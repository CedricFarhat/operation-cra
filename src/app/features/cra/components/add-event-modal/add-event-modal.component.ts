import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { randUuid } from '@ngneat/falso';
import { setHours, setMinutes } from 'date-fns';
import { activites, dateFormatLabel } from '@features/cra/constants/cra.constants';
import { CraFormHelper } from '@features/cra/helpers/cra-form.helper';
import { Leave } from '@features/cra/models/project.enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { randJobTitle } from '@ngneat/falso';

@Component({
  selector: 'add-event-modal',
  standalone: true,
  imports: [
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
    MatFormFieldModule],
  schemas: [],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }
  ],
  templateUrl: './add-event-modal.component.html',
  styleUrl: '../event-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEventModalComponent implements OnInit {
  dialogRef = inject(MatDialogRef);
  incomingData = inject(MAT_DIALOG_DATA);
  formBuilder = inject(FormBuilder);
  formHelper = inject(CraFormHelper);
  snackBar = inject(MatSnackBar);

  form: FormGroup = this.formHelper.initForm();

  title = signal("Ajouter une activité");
  dateFormatLabel = dateFormatLabel;
  activites = activites;

  hours: { label: string, value: number[] }[] = [];

  constructor() { }

  ngOnInit(): void {
    const dayStartHour = this.incomingData.dayStartHour();
    const dayEndHour = this.incomingData.dayEndHour();
    this.form.controls['startDate'].setValue(this.incomingData.timeClicked);
    this.form.controls['endDate'].setValue(this.incomingData.timeClicked);
    this.hours = this.formHelper.initHoursList(dayStartHour, dayEndHour);
    const startHour = this.formHelper.initStartTime(this.hours, this.incomingData.timeClicked);
    this.form.controls['startHour'].setValue(startHour);
  }

  submit(): void {
    if (!this.form.valid) {
      this.snackBar.open('Veuillez remplir tous les champs', 'Undo', {
        duration: 2000
      });
    } else {
      let daysDiff = this.formHelper.getSelectedDaysIncluded(
        this.form.controls['endDate'].value,
        this.form.controls['startDate'].value
      )
      if (this.form.controls['activite'].value.name === Leave.REST) {
        if ((daysDiff) > this.incomingData.daysOffRemaining || (daysDiff === 0 && this.incomingData.daysOffRemaining <= 1)) {
          this.snackBar.open('Vous n\'avez pas assez de congés', 'Undo', {
            duration: 2000
          });
          return;
        }
      }

      let startDate = this.form.controls['startDate'].value;
      startDate = setHours(startDate, this.form.controls['startHour'].value[0]);
      startDate = setMinutes(startDate, this.form.controls['startHour'].value[1]);

      let endDate = this.form.controls['endDate'].value;
      endDate = setHours(endDate, this.form.controls['endHour'].value[0]);
      endDate = setMinutes(endDate, this.form.controls['endHour'].value[1]);
      this.dialogRef.close({
        id: randUuid(),
        activite: this.form.controls['activite'].value,
        label: this.form.controls['label'].value,
        startDate,
        endDate,
        daysOffTaken: daysDiff
      });
    }

  }

  cancel(): void {
    this.dialogRef.close();
  }

  onChangeActivite(event: MatSelectChange): void {
    if (event.value.name === Leave.REST) {
      this.setFirstHour();
      this.setLastHour();
      this.form.controls['startHour'].disable();
      this.form.controls['endHour'].disable();
    } else {
      this.form.controls['startHour'].enable();
      this.form.controls['endHour'].enable();
    }
  }

  setLastHour(): void {
    const finaleDate = this.formHelper.setHours(new Date, this.incomingData.dayEndHour(), 0);
    const endHour = this.formHelper.initStartTime(this.hours, finaleDate);
    this.form.controls['endHour'].setValue(endHour);
  }

  setFirstHour(): void {
    const finaleDate = this.formHelper.setHours(new Date, this.incomingData.dayStartHour(), 0);
    const endHour = this.formHelper.initStartTime(this.hours, finaleDate);
    this.form.controls['startHour'].setValue(endHour);
  }

  generateLabel(): void {
    this.form.controls['label'].setValue(randJobTitle({ length: 1 }));
  }
}
