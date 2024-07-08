import { Injectable, inject } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { getHours, getMinutes, setHours, setMinutes } from "date-fns";

@Injectable({
  providedIn: 'root'
})
export class CraFormHelper {

  formBuilder = inject(FormBuilder);

  initForm(): FormGroup {
    return this.formBuilder.group({
      activite: new FormControl('', Validators.required),
      label: new FormControl('', Validators.required),
      startDate: new FormControl('', Validators.required),
      startHour: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      endHour: new FormControl('', Validators.required),
    });
  }

  initHoursList(dayStartHour: number, dayEndHour: number): { label: string, value: number[] }[] {
    const hours = [];
    for (let i = dayStartHour; i <= dayEndHour; i++) {
      //value is a tuple of hour and minutes
      hours.push(
        {
          label: `${i.toString()}H${'00'}`,
          value: [i, 0]
        })
      if (i < dayEndHour) {
        hours.push({
          label: `${i.toString()}H${'30'}`,
          value: [i, 30]
        })
      }
    }
    return hours;
  }

  initStartTime(hours: { label: string, value: number[] }[], time: Date): number[] {
    let hour = getHours(time);
    let minutes = getMinutes(time);
    const timeIndex = hours.findIndex(element => (element.value[0] === hour) && (element.value[1] === minutes));
    return hours[timeIndex].value;
  }

  setHours(date: Date, hour: number, minutes: number): Date {
    const dateWithHours = setHours(date, hour);
    const finalDate = setMinutes(dateWithHours, minutes);
    return finalDate;
  }
}
