import { ActionsUpdatedEvent } from '../models/action-event'
import { Injectable } from '@angular/core'

@Injectable()
export abstract class ActionEventParser {
  public abstract parseActionsUpdatedEvent(event: unknown): ActionsUpdatedEvent
}
