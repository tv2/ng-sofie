import { MediaEventParser } from '../abstractions/media-event-parser'
import { MediaCreatedEvent, MediaDeletedEvent, MediaUpdatedEvent } from '../models/media-event'
import * as zod from 'zod'
import { MediaEventType } from '../models/media-event-type'
import { EntityParser } from '../abstractions/entity-parser.service'
import { Injectable } from '@angular/core'

@Injectable()
export class ZodMediaEventParserService implements MediaEventParser {
  constructor(private readonly entityParser: EntityParser) {}

  public parseMediaCreatedEvent(event: unknown): MediaCreatedEvent {
    return zod
      .object({
        type: zod.literal(MediaEventType.MEDIA_CREATED),
        timestamp: zod.number(),
        media: zod
          .object({})
          .passthrough()
          .transform((media: unknown) => this.entityParser.parseMediaAsset(media)),
      })
      .parse(event)
  }

  public parseMediaDeletedEvent(event: unknown): MediaDeletedEvent {
    return zod
      .object({
        type: zod.literal(MediaEventType.MEDIA_DELETED),
        timestamp: zod.number(),
        mediaId: zod.string(),
      })
      .parse(event)
  }

  public parseMediaUpdatedEvent(event: unknown): MediaUpdatedEvent {
    return zod
      .object({
        type: zod.literal(MediaEventType.MEDIA_UPDATED),
        timestamp: zod.number(),
        media: zod
          .object({})
          .passthrough()
          .transform((media: unknown) => this.entityParser.parseMediaAsset(media)),
      })
      .parse(event)
  }
}
