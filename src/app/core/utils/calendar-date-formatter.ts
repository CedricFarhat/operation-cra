import { Injectable } from "@angular/core";
import { CalendarNativeDateFormatter, DateFormatterParams } from "angular-calendar";

@Injectable({
    providedIn: 'root'
})
export class CustomDateFormatter extends CalendarNativeDateFormatter {

    public override dayViewHour({ date, locale }: DateFormatterParams): string {
        return new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: 'numeric' }).format(date);
    }

    public override weekViewHour({ date, locale }: DateFormatterParams): string {
        return new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: 'numeric' }).format(date);
    }
}