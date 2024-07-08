import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {
  CalendarDateFormatter,
  CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarModule, CalendarView,
} from 'angular-calendar';
import { isSameMonth, isSameDay } from "date-fns";
import { Subject } from 'rxjs';
import { CustomDateFormatter } from '@core/utils/calendar-date-formatter';
import { CraStore } from '@features/cra/cra.store';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddEventModalComponent } from '@features/cra/components/add-event-modal/add-event-modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Agent, Event } from '../models/cra.model';
import { FormsModule } from '@angular/forms';
import { activites, agent1 } from '../constants/cra.constants';
import { ActivityColors } from '../models/project.enum';
import { ModifyEventModalComponent } from './modify-event-modal/modify-event-modal.component';

@Component({
  selector: 'cra',
  standalone: true,
  imports: [RouterOutlet,
    CommonModule,
    CalendarModule,
    MatDialogModule,
    FontAwesomeModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule],
  providers: [{
    provide: CalendarDateFormatter, useClass: CustomDateFormatter
  }
  ],
  templateUrl: './cra.component.html',
  styleUrl: './cra.component.scss'
})
export class CraComponent {
  readonly store = inject(CraStore);
  dialogService = inject(MatDialog);

  viewDate = signal(new Date());
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  activeDayIsOpen = false;
  daysToRemove = signal([0, 6]); // Doc: An array of day indexes (0 = sunday, 1 = monday etc) that will be hidden on the view
  dayStartHour = signal(8); // 8h00
  dayEndHour = signal(18); // 18h00
  refresh = new Subject<void>;
  agents = signal<Agent[]>([]);
  currentAgent = signal<Agent>(this.store.agents()[0]);
  eventTitle = signal<string>('');

  computedEvents = computed(() => {
    return this.currentAgent().events.map((event: Event) => {
      return {
        id: event.id,
        title: event.label,
        start: event.start,
        end: event.end,
        color: {
          primary: event.activite.color,
          secondary: event.activite.color
        },
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        },
        actions: this.actions
      }
    })
  });

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.updateEvent(event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.store.removeEvent(this.currentAgent().id, event.id);
        const foundAgent = this.store.agents().find((agent: Agent) => agent.id === this.currentAgent().id);
        this.store.updateCurrentAgent(foundAgent!);
        this.currentAgent.set(foundAgent!);
        this.agents.set(this.store.agents())
      },
    },
  ];

  constructor() {
    agent1.events = [{
      id: 1,
      label: 'Test',
      start: new Date("2024-07-08T12:30"),
      end: new Date("2024-07-08T17:30"),
      activite: {
        id: 1,
        color: ActivityColors.PROJECT_VENOM
      }
    }]
    this.currentAgent.set(agent1);
    this.refresh.next();
    this.agents.set(this.store.agents());
  }

  setView(view: CalendarView): void {
    this.view = view;
  }

  addEvent(event: {
    date: Date;
    sourceEvent: MouseEvent;
  }): void {
    let dialogRef = this.dialogService.open(AddEventModalComponent, {
      data: {
        timeClicked: event.date,
        dayStartHour: this.dayStartHour,
        dayEndHour: this.dayEndHour,
        daysOffRemaining: this.currentAgent().daysOffRemaining
      },
      disableClose: true,
      width: '700px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.daysOffTaken) {
          this.store.updateAgent({
            ...this.currentAgent(),
            daysOffRemaining: this.currentAgent().daysOffRemaining - result.daysOffTaken
          })
        }
        this.store.addEvent(this.currentAgent().id, {
          id: result.id,
          label: result.label,
          start: result.startDate,
          end: result.endDate,
          activite: result.activite
        });
        const foundAgent = this.store.agents().find((agent: Agent) => agent.id === this.currentAgent().id);
        this.store.updateCurrentAgent(foundAgent!);
        this.agents.set(this.store.agents())
        this.currentAgent.set(foundAgent!);
        this.refresh.next();
      }
    });
  }

  updateEvent(event: CalendarEvent): void {
    const modifiedEvent = this.currentAgent().events.find(element => element.id === event.id);
    let dialogRef = this.dialogService.open(ModifyEventModalComponent, {
      data: {
        eventId: event.id,
        activite: activites.find(activite => activite.id === modifiedEvent!.activite.id),
        startDate: event.start,
        endDate: event.end,
        label: event.title,
        dayStartHour: this.dayStartHour,
        dayEndHour: this.dayEndHour,
        daysOffRemaining: this.currentAgent().daysOffRemaining
      },
      disableClose: true,
      width: '700px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.daysOffTaken) {
          this.store.updateAgent({
            ...this.currentAgent(),
            daysOffRemaining: this.currentAgent().daysOffRemaining - result.daysOffTaken
          })
        }
        this.store.updateEvent(this.currentAgent().id, {
          id: result.id,
          label: result.label,
          start: result.startDate,
          end: result.endDate,
          activite: result.activite
        });
        const foundAgent = this.store.agents().find((agent: Agent) => agent.id === this.currentAgent().id);
        this.store.updateCurrentAgent(foundAgent!);
        this.agents.set(this.store.agents())
        this.currentAgent.set(foundAgent!);
        this.refresh.next();
      }
    });

  }

  eventTimesChanged(timeChangeEvent: CalendarEventTimesChangedEvent): void {
    const currentEvent = timeChangeEvent.event;
    currentEvent.start = timeChangeEvent.newStart;
    currentEvent.end = timeChangeEvent.newEnd
    this.refresh.next();
  }

  dayClicked({ date, events }: { date: Date, events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate())) {
      if ((isSameDay(this.viewDate(), date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate.set(date);
    }
  }
}
