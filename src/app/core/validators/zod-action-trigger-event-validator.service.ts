import { Injectable } from '@angular/core'
import { ActionTriggerEventValidator } from '../abstractions/action-trigger-event-validator.service'
import { ActionTriggerCreatedEvent, ActionTriggerDeletedEvent, ActionTriggerUpdatedEvent } from '../models/action-trigger-event'
import * as zod from 'zod'
import { ActionTriggerEventType } from '../models/action-trigger-event-type'

@Injectable()
export class ZodActionTriggerEventValidator implements ActionTriggerEventValidator {
  public parseActionTriggerCreatedEvent(event: ActionTriggerCreatedEvent): ActionTriggerCreatedEvent {
    return zod
      .object({
        type: zod.literal(ActionTriggerEventType.ACTION_TRIGGER_CREATED),
        timestamp: zod.number(),
        actionTrigger: zod.object({
          id: zod.string(),
          actionId: zod.string(),
          data: zod.object({
            keys: zod.string().array(),
            actionArguments: zod.number().or(zod.string().optional()).optional(),
          }),
        }),
      })
      .parse(event)
  }

  public parseActionTriggerUpdatedEvent(event: ActionTriggerUpdatedEvent): ActionTriggerUpdatedEvent {
    return zod
      .object({
        type: zod.literal(ActionTriggerEventType.ACTION_TRIGGER_UPDATED),
        timestamp: zod.number(),
        actionTrigger: zod.object({
          id: zod.string(),
          actionId: zod.string(),
          data: zod.object({
            keys: zod.string().array(),
            actionArguments: zod.number().or(zod.string().optional()).optional(),
          }),
        }),
      })
      .parse(event)
  }

  public parseActionTriggerDeletedEvent(event: ActionTriggerDeletedEvent): ActionTriggerDeletedEvent {
    return zod
      .object({
        type: zod.literal(ActionTriggerEventType.ACTION_TRIGGER_DELETED),
        timestamp: zod.number(),
        actionTriggerId: zod.string(),
      })
      .parse(event)
  }
}
