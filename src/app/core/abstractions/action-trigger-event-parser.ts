import { Injectable } from '@angular/core'
import {
  ActionTriggerCreatedEvent,
  ActionTriggerDeletedEvent,
  ActionTriggerUpdatedEvent
} from '../models/action-trigger-event'

@Injectable()
export abstract class ActionTriggerEventParser {

  public abstract parseActionTriggerCreatedEvent(event: unknown): ActionTriggerCreatedEvent
  public abstract parseActionTriggerUpdatedEvent(event: unknown): ActionTriggerUpdatedEvent
  public abstract parseActionTriggerDeletedEvent(event: unknown): ActionTriggerDeletedEvent
}
