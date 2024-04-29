import { ActionEventParser } from '../abstractions/action-event-parser'
import { ActionsUpdatedEvent } from '../models/action-event'
import * as zod from 'zod'
import { Injectable } from '@angular/core'
import { ActionParser } from '../../shared/abstractions/action-parser.service'
import { ActionEventType } from '../models/action-event-type'

@Injectable()
export class ZodActionEventParser implements ActionEventParser {
  constructor(private readonly actionParser: ActionParser) {}

  public parseActionsUpdatedEvent(event: unknown): ActionsUpdatedEvent {
    return zod
      .object({
        type: zod.literal(ActionEventType.ACTIONS_UPDATED),
        timestamp: zod.number(),
        actions: zod
          .object({})
          .passthrough()
          .transform(action => this.actionParser.parseAction(action))
          .array(),
        rundownId: zod.string().optional(),
      })
      .parse(event)
  }
}
