import { Agent, Project } from "../models/cra.model"
import { ActivityColors, Leave, ProjectNames } from "../models/project.enum"

export const DAY_START_HOUR = 8;
export const DAY_END_HOUR = 18;
export const SUNDAY = 0;
export const SATURDAY = 6;
export const INVALID_FORM_MESSAGE = 'Veuillez remplir tous les champs';

export const AGENT1: Agent = {
  id: 1,
  name: "Agent 005",
  daysOffRemaining: 5,
  events: []
}

export const AGENT2: Agent = {
  id: 2,
  name: "Agent 006",
  daysOffRemaining: 5,
  events: []
}

export const AGENT3: Agent = {
  id: 3,
  name: "Agent 007",
  daysOffRemaining: 5,
  events: []
}

export const PROJECT1: Project = {
  id: 1,
  name: ProjectNames.PROJECT_VENOM,
  color: ActivityColors.PROJECT_VENOM
}

export const PROJECT2: Project = {
  id: 2,
  name: ProjectNames.PROJECT_AZURA,
  color: ActivityColors.PROJECT_AZURA
}

export const PROJECT3: Project = {
  id: 3,
  name: ProjectNames.PROJECT_AMBER,
  color: ActivityColors.PROJECT_AMBER
}

export const LEAVES = {
  id: 4,
  name: Leave.REST,
  color: ActivityColors.REST
}

export const DATE_FORMAT_LABEL = "JJ/MM/AAAA";

export const ACTIVITES = [PROJECT1, PROJECT2, PROJECT3, LEAVES];
