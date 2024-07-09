import { Agent, Project } from "../models/cra.model"
import { ActivityColors, Leave, ProjectNames } from "../models/project.enum"

export const agent1: Agent = {
    id: 1,
    name: "Agent 005",
    daysOffRemaining: 5,
    events: []
}

export const agent2: Agent = {
    id: 2,
    name: "Agent 006",
    daysOffRemaining: 5,
    events: []
}

export const agent3: Agent = {
    id: 3,
    name: "Agent 007",
    daysOffRemaining: 5,
    events: []
}

export const project1: Project = {
    id: 1,
    name: ProjectNames.PROJECT_VENOM,
    color: ActivityColors.PROJECT_VENOM
}

export const project2: Project = {
    id: 2,
    name: ProjectNames.PROJECT_AZURA,
    color: ActivityColors.PROJECT_AZURA
}

export const project3: Project = {
    id: 3,
    name: ProjectNames.PROJECT_AMBER,
    color: ActivityColors.PROJECT_AMBER
}

export const leaves = {
    id: 4,
    name: Leave.REST,
    color: ActivityColors.REST
}

export const dateFormatLabel = "JJ/MM/AAAA";

export const activites = [project1, project2, project3, leaves];
