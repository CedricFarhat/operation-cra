import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CraComponent } from './cra.component';
import { CommonModule, registerLocaleData } from '@angular/common';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import localeFr from '@angular/common/locales/fr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ModifyEventModalComponent } from './modify-event-modal/modify-event-modal.component';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { addDays } from 'date-fns';
import { signal } from '@angular/core';
import { ActivityColors } from '../models/project.enum';

registerLocaleData(localeFr, 'fr');

describe('CraComponent', () => {
  let component: CraComponent;
  let fixture: ComponentFixture<CraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CraComponent,

        CommonModule,
        CalendarModule.forRoot({
          provide: DateAdapter,
          useFactory: adapterFactory,
        }),
        BrowserAnimationsModule,
        MatDialogModule,
        FontAwesomeModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        FormsModule,
        ModifyEventModalComponent
      ],
      providers: []
    })
      .compileComponents();

    fixture = TestBed.createComponent(CraComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the view correctly', () => {

    // WHEN
    component.setView(CalendarView.Month);

    // THEN
    expect(component.view).toBe(CalendarView.Month);
  });

  it('should add an event', () => {

    // GIVEN
    const startDate = new Date();
    const endDate = addDays(new Date(), 1);
    const testAgent = component.store.agents()[0];
    const today = new Date();
    const inputEvent = {
      date: today,
      sourceEvent: new MouseEvent('click')
    };
    component.currentAgent = signal(testAgent);

    jest.spyOn(component.dialogService, 'open').mockReturnValue({
      afterClosed: () => of({
        id: 1,
        label: 'Add Event Label',
        startDate: startDate,
        endDate: endDate,
        activite: { id: 1, color: ActivityColors.PROJECT_AZURA },
        daysOffTaken: 1
      })
    } as MatDialogRef<typeof component>);

    // WHEN
    component.addEvent(inputEvent);

    // THEN
    const foundTestAgent = component.store.agents().find(agent => agent.id === testAgent.id);
    expect(foundTestAgent!.events[0].label).toBe('Add Event Label');

  });

  it('should update an event', () => {

    // GIVEN
    const startDate = new Date();
    const endDate = addDays(new Date(), 1);
    component.store.addEvent(component.currentAgent().id, {
      id: 1,
      label: 'That label should be updated',
      start: startDate,
      end: endDate,
      activite: { id: 1, color: ActivityColors.PROJECT_AZURA },
    });
    const testAgent = component.store.agents()[0];
    component.currentAgent = signal(testAgent);

    jest.spyOn(component.dialogService, 'open').mockReturnValue({
      afterClosed: () => of({
        id: 1,
        label: 'New updated label',
        startDate: startDate,
        endDate: endDate,
        activite: { id: 1, color: ActivityColors.PROJECT_AZURA },
        daysOffTaken: 1
      })
    } as MatDialogRef<typeof component>);

    const inputEvent: CalendarEvent = {
      id: 1,
      title: 'Test Event',
      start: startDate,
      end: endDate,
      color: { primary: 'blue', secondary: 'blue' },
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      actions: []
    };

    // WHEN
    component.updateEvent(inputEvent);

    // THEN
    const foundTestAgent = component.store.agents().find(agent => agent.id === testAgent.id);
    expect(foundTestAgent!.events[0].label).toBe('New updated label');
  });
});
