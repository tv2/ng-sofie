import { TypedEvent } from '../../event-system/abstractions/event-observer.service'
import { ActionTriggerEventType } from './action-trigger-event-type'
import { ActionTrigger, KeyboardTriggerData } from '../../shared/models/action-trigger'

export interface ActionTriggerEvent extends TypedEvent {
  type: ActionTriggerEventType
}

export interface ActionTriggerCreatedEvent extends ActionTriggerEvent {
  type: ActionTriggerEventType.ACTION_TRIGGER_CREATED
  actionTrigger: ActionTrigger<KeyboardTriggerData>
}

export interface ActionTriggerUpdatedEvent extends ActionTriggerEvent {
  type: ActionTriggerEventType.ACTION_TRIGGER_UPDATED
  actionTrigger: ActionTrigger<KeyboardTriggerData>
}

export interface ActionTriggerDeletedEvent extends ActionTriggerEvent {
  type: ActionTriggerEventType.ACTION_TRIGGER_DELETED
  actionTriggerId: string
}
