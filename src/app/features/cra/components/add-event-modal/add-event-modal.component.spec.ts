import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventModalComponent } from './add-event-modal.component';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { mockDialogData, mockDialogRef } from '@features/cra/constants/cra-mock.constants';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AddEventModalComponent', () => {
  let component: AddEventModalComponent;
  let fixture: ComponentFixture<AddEventModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEventModalComponent,
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

    fixture = TestBed.createComponent(AddEventModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
