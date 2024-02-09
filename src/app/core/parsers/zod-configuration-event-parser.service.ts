import { ConfigurationEventParser } from '../abstractions/configuration-event-parser'
import { ShelfConfigurationUpdatedEvent } from '../models/configuration-event'
import { ConfigurationParser } from '../../shared/abstractions/configuration-parser.service'
import { ConfigurationEventType } from '../models/configuration-event-type'
import * as zod from 'zod'
import { Injectable } from '@angular/core'

@Injectable()
export class ZodConfigurationEventParser extends ConfigurationEventParser {
  constructor(private readonly configurationParser: ConfigurationParser) {
    super()
  }

  public parseShelfConfigurationUpdatedEvent(event: unknown): ShelfConfigurationUpdatedEvent {
    return zod
      .object({
        type: zod.literal(ConfigurationEventType.SHELF_UPDATED),
        timestamp: zod.number(),
        shelf: zod
          .object({})
          .passthrough()
          .transform((shelfConfiguration: unknown) => this.configurationParser.parseShelfConfiguration(shelfConfiguration)),
      })
      .parse(event)
  }
}
