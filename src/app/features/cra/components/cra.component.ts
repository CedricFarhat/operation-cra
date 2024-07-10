import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CalendarDateFormatter,
  CalendarEvent, CalendarEventAction, CalendarModule, CalendarView,
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
import { DAY_END_HOUR, DAY_START_HOUR, SATURDAY, SUNDAY, ACTIVITES } from '../constants/cra.constants';
import { ModifyEventModalComponent } from './modify-event-modal/modify-event-modal.component';

@Component({
  selector: 'cra',
  standalone: true,
  imports: [
    CommonModule,
    CalendarModule,
    MatDialogModule,
    FontAwesomeModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule
  ],
  providers: [{
    provide: CalendarDateFormatter, useClass: CustomDateFormatter,
  }
  ],
  templateUrl: './cra.component.html',
  styleUrl: './cra.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CraComponent {
  readonly store = inject(CraStore);
  dialogService = inject(MatDialog);

  viewDate = signal(new Date());
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  activeDayIsOpen = false;
  refresh = new Subject<void>;
  daysToRemove = signal([SUNDAY, SATURDAY]); // days to exclude from the calendar
  dayStartHour = signal(DAY_START_HOUR);
  dayEndHour = signal(DAY_END_HOUR);
  agents = signal<Agent[]>([]);
  currentAgent = signal<Agent>(this.store.agents()[0]);

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
        this.currentAgent.set(foundAgent!);
        this.agents.set(this.store.agents())
      },
    },
  ];

  constructor() {
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
        activite: ACTIVITES.find(activite => activite.id === modifiedEvent!.activite.id),
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
        this.agents.set(this.store.agents())
        this.currentAgent.set(foundAgent!);
        this.refresh.next();
      }
    });

  }

  eventTimesChanged(calendarEvent: any): void {
    this.store.updateEvent(this.currentAgent().id, {
      id: calendarEvent.event.id,
      label: calendarEvent.event.title,
      start: calendarEvent.newStart,
      end: calendarEvent.newEnd,
      activite: this.currentAgent().events.find(element => element.id === calendarEvent.event.id)!.activite
    });
    const foundAgent = this.store.agents().find((agent: Agent) => agent.id === this.currentAgent().id);
    this.agents.set(this.store.agents())
    this.currentAgent.set(foundAgent!);

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
