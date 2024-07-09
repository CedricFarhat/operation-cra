import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModifyEventModalComponent } from './modify-event-modal.component';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { mockDialogData, mockDialogRef } from '@features/cra/constants/cra-mock.constants';
import { setHours, setMinutes } from 'date-fns';
import { Leave, ProjectNames } from '@features/cra/models/project.enum';

describe('ModifyEventModalComponent', () => {
  let component: ModifyEventModalComponent;
  let fixture: ComponentFixture<ModifyEventModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyEventModalComponent,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatDividerModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatInputModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ModifyEventModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initForm', () => {

    it('should initialize form controls with incoming data', () => {

      // GIVEN
      component.incomingData = {
        dayStartHour: jest.fn(() => 8),
        dayEndHour: jest.fn(() => 18),
        startDate: setMinutes(setHours(new Date(), 10), 0),
        endDate: setMinutes(setHours(new Date(), 17), 0),
        label: 'Test',
        activite: { name: ProjectNames.PROJECT_AMBER }
      };

      // WHEN
      component.initForm();

      // THEN
      expect(component.form.controls['startDate'].value).toEqual(component.incomingData.startDate);
      expect(component.form.controls['endDate'].value).toEqual(component.incomingData.endDate);
      expect(component.form.controls['label'].value).toEqual(component.incomingData.label);
      expect(component.form.controls['activite'].value).toEqual(component.activites.find(elem => elem.name === component.incomingData.activite.name));
      expect(component.form.controls['startHour'].value).toEqual([10, 0])
      expect(component.form.controls['endHour'].value).toEqual([17, 0])
    });
  });

  describe('submit', () => {

    it('should send the data if the form is valid', () => {

      // GIVEN
      component.incomingData = {
        dayStartHour: jest.fn(() => 8),
        dayEndHour: jest.fn(() => 18),
        startDate: setMinutes(setHours(new Date(), 10), 0),
        endDate: setMinutes(setHours(new Date(), 17), 0),
        label: 'Test',
        activite: {
          id: 1,
          name: ProjectNames.PROJECT_AMBER
        }
      };

      // WHEN
      component.initForm();
      component.submit();

      // THEN
      expect(component.dialogRef.close).toHaveBeenCalledWith({
        id: component.incomingData.eventId,
        activite: component.form.controls['activite'].value,
        label: component.form.controls['label'].value,
        startDate: component.incomingData.startDate,
        endDate: component.incomingData.endDate,
        daysOffTaken: null
      }
      )
    })
  })

  it('should open snack bar if the form is invalid', () => {

    // GIVEN
    component.snackBar.open = jest.fn();
    component.incomingData = {
      dayStartHour: jest.fn(() => 8),
      dayEndHour: jest.fn(() => 18),
      startDate: setMinutes(setHours(new Date(), 10), 0),
      endDate: setMinutes(setHours(new Date(), 17), 0),
      label: null,
      activite: {
        id: 1,
        name: ProjectNames.PROJECT_AMBER
      }
    };

    // WHEN
    component.initForm();
    component.submit();

    // THEN
    expect(component.snackBar.open).toHaveBeenCalled();
  });

  describe('onChangeActivite', () => {


    it('should disable startHour and endHour controls when activite is Leave.REST', () => {

      // GIVEN
      const mockEvent = {
        source: {} as MatSelect,
        value: { name: Leave.REST }
      };

      // WHEN
      component.onChangeActivite(mockEvent);

      // THEN
      expect(component.form.controls['startHour'].disabled).toBe(true);
      expect(component.form.controls['endHour'].disabled).toBe(true);
    });

    it('should enable startHour and endHour controls when activite is not Leave.REST', () => {

      // GIVEN
      const mockEvent = {
        source: {} as MatSelect,
        value: { name: 'Test' }
      };

      // WHEN
      component.onChangeActivite(mockEvent);

      // THEN
      expect(component.form.controls['startHour'].enabled).toBe(true);
      expect(component.form.controls['endHour'].enabled).toBe(true);
    });
  });

  describe('setLastHour', () => {

    it('should set correct endHour', () => {

      // GIVEN
      component.incomingData = {
        dayStartHour: jest.fn(() => 8),
        dayEndHour: jest.fn(() => 14),
        startDate: setMinutes(setHours(new Date(), 10), 0),
        endDate: setMinutes(setHours(new Date(), 14), 0),
        label: 'Test',
        activite: {
          id: 1,
          name: ProjectNames.PROJECT_AMBER
        }
      };

      // WHEN
      component.initForm();
      component.setLastHour();

      // THEN
      expect(component.form.controls['endHour'].value).toEqual([14, 0]);
    });
  });

  describe('setFirstHour', () => {

    it('should set correct startHour', () => {

      // GIVEN
      component.incomingData = {
        dayStartHour: jest.fn(() => 10),
        dayEndHour: jest.fn(() => 14),
        startDate: setMinutes(setHours(new Date(), 10), 0),
        endDate: setMinutes(setHours(new Date(), 14), 0),
        label: 'Test',
        activite: {
          id: 1,
          name: ProjectNames.PROJECT_AMBER
        }
      };

      // WHEN
      component.initForm();
      component.setFirstHour();

      // THEN
      expect(component.form.controls['startHour'].value).toEqual([10, 0]);
    });
  });


});
