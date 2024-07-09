import { agent1, agent2, agent3 } from "../constants/cra.constants"
import { ProjectNames } from "./project.enum"

export type Event = {
  id: number,
  label: string,
  start: Date,
  end: Date,
  activite: Activity
}

export interface Activity {
  id: number;
  color: string,
}

export interface Project extends Activity {
  name: ProjectNames,
}

export interface Leave extends Activity {
  name: Leave,
}

export type Agent = {
  id: number,
  name: string,
  daysOffRemaining: number,
  events: Event[]
}

export type CraState = {
  agents: Agent[],
}

export const initialCraState = {
  agents: [agent1, agent2, agent3],
}


