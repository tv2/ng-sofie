import { Injectable } from '@angular/core'
import { MediaCreatedEvent, MediaDeletedEvent, MediaUpdatedEvent } from '../models/media-event'

@Injectable()
export abstract class MediaEventParser {
  public abstract parseMediaCreatedEvent(event: unknown): MediaCreatedEvent
  public abstract parseMediaUpdatedEvent(event: unknown): MediaUpdatedEvent
  public abstract parseMediaDeletedEvent(event: unknown): MediaDeletedEvent
}
