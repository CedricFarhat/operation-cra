import { signal } from "@angular/core";
import { addDays, setHours, setMinutes } from "date-fns";
import { ActivityColors, ProjectNames } from "../models/project.enum";
import { DAY_END_HOUR, DAY_START_HOUR } from "./cra.constants";

export const mockDialogData = {
  dayStartHour: signal(DAY_START_HOUR),
  dayEndHour: signal(DAY_END_HOUR),
  startDate: setMinutes(setHours(new Date(), DAY_START_HOUR), 0),
  endDate: setMinutes(setHours(new Date(), DAY_END_HOUR), 0),
  activite: {
    id: 1,
    name: ProjectNames.PROJECT_AZURA,
    color: ActivityColors.PROJECT_AZURA
  },
  timeClicked: setMinutes(setHours(new Date(), DAY_START_HOUR), 0)
}

export const mockDialogRef = {
  close: jest.fn(),
  afterClosed: jest.fn()
}

export const mockEvent = {
  id: 1,
  label: 'Event 1',
  start: new Date(),
  end: addDays(new Date(), 1),
  activite: {
    id: 1,
    name: ProjectNames.PROJECT_AZURA,
    color: ActivityColors.PROJECT_AZURA
  }
}
