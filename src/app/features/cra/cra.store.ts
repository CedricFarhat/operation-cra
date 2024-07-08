import { patchState, signalStore, withMethods, withState } from "@ngrx/signals"
import { Agent, CraState, Event, initialCraState } from './models/cra.model';


export const CraStore = signalStore(
    {
        providedIn: 'root',
    },
    withState<CraState>(initialCraState),
    withMethods((store) => ({

        addEvent(idAgent: number, event: Event): void {
            patchState(store, (state) => {
                const agentIndex = state.agents.findIndex(agent => agent.id === idAgent);
                if (agentIndex === -1) {
                    console.error(`Agent ${idAgent} not found`);
                    return state;
                }

                const updatedAgents = [...state.agents];
                updatedAgents[agentIndex] = {
                    ...updatedAgents[agentIndex],
                    events: [...updatedAgents[agentIndex].events, event]
                };

                return {
                    ...state,
                    agents: updatedAgents
                };
            })
        },

        updateEvent(idAgent: number, inputEvent: Event): void {
            patchState(store, (state) => {
                const agentIndex = state.agents.findIndex(agent => agent.id === idAgent);
                if (agentIndex === -1) {
                    console.error(`Agent ${idAgent} not found`);
                    return state;
                }
                let newEvents = state.agents[agentIndex].events.filter(event => event.id !== inputEvent.id)
                newEvents.push(inputEvent);
                const updatedAgents = [...state.agents];
                updatedAgents[agentIndex] = {
                    ...updatedAgents[agentIndex],
                    events: newEvents
                };

                return {
                    ...state,
                    agents: updatedAgents
                }
            })
        },

        updateCurrentAgent(agent: Agent): void {
            patchState(store, (state) => {
                return {
                    ...state,
                    currentAgent: agent
                };
            });
        },

        removeEvent(idAgent: number, eventId: number | string | undefined): void {
            patchState(store, (state) => {
                const agentIndex = state.agents.findIndex(agent => agent.id === idAgent);
                if (agentIndex === -1) {
                    console.error(`Agent ${idAgent} not found`);
                    return state;
                }
                const updatedAgents = [...state.agents];
                updatedAgents[agentIndex] = {
                    ...updatedAgents[agentIndex],
                    events: updatedAgents[agentIndex].events.filter(element => element.id !== eventId)
                };

                return {
                    ...state,
                    agents: updatedAgents
                };
            })
        },

        updateAgent(newAgent: Agent): void {
            patchState(store, (state) => {
                const agentIndex = state.agents.findIndex(agent => agent.id === newAgent.id);
                if (agentIndex === -1) {
                    console.error(`Agent ${newAgent.id} not found`);
                    return state;
                }

                const agents = state.agents.filter(agent => agent.id !== newAgent.id);
                agents.push(newAgent);

                return {
                    ...state,
                    agents
                }
            })

        }
    }))
)
