import { Injectable, inject } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { addDays, differenceInBusinessDays, getHours, getMinutes, setHours, setMinutes, startOfDay } from "date-fns";
import { DAY_START_HOUR } from "../constants/cra.constants";

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
    if (timeIndex === -1) {
      console.error(`Time not found for ${hour}H${minutes}`);
      return [DAY_START_HOUR, 0];
    }
    return hours[timeIndex].value;
  }

  setHours(date: Date, hour: number, minutes: number): Date {
    const dateWithHours = setHours(date, hour);
    const finalDate = setMinutes(dateWithHours, minutes);
    return finalDate;
  }

  /**
   * Returns the number of days bewteen 2 dates with the endDate included
   */
  getSelectedDaysIncluded(endDate: Date, startDate: Date): number {
    return differenceInBusinessDays(
      addDays(startOfDay(endDate), 1),
      startOfDay(startDate))
  }
}
