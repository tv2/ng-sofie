import { Injectable } from '@angular/core'
import { StatusMessageEventParser } from '../abstractions/status-message-event-parser'
import { StatusMessageEvent } from '../models/status-message-event'
import * as zod from 'zod'
import { StatusMessageEventType } from '../models/status-message-event-type'
import { EntityParser } from '../abstractions/entity-parser.service'

@Injectable()
export class ZodStatusMessageEventParser implements StatusMessageEventParser {
  constructor(private readonly entityParser: EntityParser) {}

  public parseStatusMessageEvent(event: unknown): StatusMessageEvent {
    return zod
      .object({
        type: zod.literal(StatusMessageEventType.STATUS_MESSAGE),
        timestamp: zod.number(),
        statusMessage: zod
          .object({})
          .passthrough()
          .transform(statusMessage => this.entityParser.parseStatusMessage(statusMessage)),
      })
      .parse(event)
  }
}
