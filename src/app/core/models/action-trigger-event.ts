import { TypedEvent } from '../../event-system/abstractions/event-observer.service'
import { ActionTriggerEventType } from './action-trigger-event-type'
import { ActionTrigger } from '../../shared/models/action-trigger'

export interface ActionTriggerEvent extends TypedEvent {
  type: ActionTriggerEventType
}

export interface ActionTriggerCreatedEvent extends ActionTriggerEvent {
  type: ActionTriggerEventType.ACTION_TRIGGER_CREATED
  actionTrigger: ActionTrigger
}

export interface ActionTriggerUpdatedEvent extends ActionTriggerEvent {
  type: ActionTriggerEventType.ACTION_TRIGGER_UPDATED
  actionTrigger: ActionTrigger
}

export interface ActionTriggerDeletedEvent extends ActionTriggerEvent {
  type: ActionTriggerEventType.ACTION_TRIGGER_DELETED
  actionTriggerId: string
}
