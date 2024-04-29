import { TypedEvent } from '../../event-system/abstractions/event-observer.service'
import { ActionEventType } from './action-event-type'
import { Action } from '../../shared/models/action'

export interface ActionEvent extends TypedEvent {
  type: ActionEventType
}

export interface ActionsUpdatedEvent extends ActionEvent {
  type: ActionEventType.ACTIONS_UPDATED
  actions: Action[]
  rundownId?: string
}
