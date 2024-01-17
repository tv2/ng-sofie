import { Injectable } from '@angular/core'
import { ActionTriggerEventParser } from '../abstractions/action-trigger-event-parser'
import { ActionTriggerCreatedEvent, ActionTriggerDeletedEvent, ActionTriggerUpdatedEvent } from '../models/action-trigger-event'
import * as zod from 'zod'
import { ActionTriggerEventType } from '../models/action-trigger-event-type'
import { ActionTriggerParser } from 'src/app/shared/abstractions/action-trigger-parser.service'

@Injectable()
export class ZodActionTriggerEventParser implements ActionTriggerEventParser {
  constructor(private readonly actionTriggerParser: ActionTriggerParser) {}
  public parseActionTriggerCreatedEvent(event: unknown): ActionTriggerCreatedEvent {
    return zod
      .object({
        type: zod.literal(ActionTriggerEventType.ACTION_TRIGGER_CREATED),
        timestamp: zod.number(),
        actionTrigger: zod.object({
          id: zod.string(),
          actionId: zod.string(),
          data: zod
            .object({})
            .passthrough()
            .transform((data: unknown) => this.actionTriggerParser.parseActionTriggerData(data)),
        }),
      })
      .parse(event)
  }

  public parseActionTriggerUpdatedEvent(event: unknown): ActionTriggerUpdatedEvent {
    return zod
      .object({
        type: zod.literal(ActionTriggerEventType.ACTION_TRIGGER_UPDATED),
        timestamp: zod.number(),
        actionTrigger: zod.object({
          id: zod.string(),
          actionId: zod.string(),
          data: zod
            .object({})
            .passthrough()
            .transform((data: unknown) => this.actionTriggerParser.parseActionTriggerData(data)),
        }),
      })
      .parse(event)
  }

  public parseActionTriggerDeletedEvent(event: unknown): ActionTriggerDeletedEvent {
    return zod
      .object({
        type: zod.literal(ActionTriggerEventType.ACTION_TRIGGER_DELETED),
        timestamp: zod.number(),
        actionTriggerId: zod.string(),
      })
      .parse(event)
  }
}
