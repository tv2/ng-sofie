import { Injectable } from '@angular/core'
import { Logger } from '../abstractions/logger.service'
import { EventConsumer, EventObserver, EventSubscription, TypedEvent } from '../../event-system/abstractions/event-observer.service'
import { MediaEventParser } from '../abstractions/media-event-parser'
import { MediaCreatedEvent, MediaDeletedEvent, MediaUpdatedEvent } from '../models/media-event'
import { MediaEventType } from '../models/media-event-type'

@Injectable()
export class MediaEventObserver {
  private readonly logger: Logger

  constructor(
    private readonly eventObserver: EventObserver,
    private readonly mediaEventParser: MediaEventParser,
    logger: Logger
  ) {
    this.logger = logger.tag('MediaEventObserverService')
  }

  public subscribeToMediaCreated(onCreated: (event: MediaCreatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(MediaEventType.MEDIA_CREATED, this.createEventValidatingConsumer(onCreated, this.mediaEventParser.parseMediaCreatedEvent.bind(this.mediaEventParser)))
  }

  public subscribeToMediaUpdated(onUpdated: (event: MediaUpdatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(MediaEventType.MEDIA_UPDATED, this.createEventValidatingConsumer(onUpdated, this.mediaEventParser.parseMediaUpdatedEvent.bind(this.mediaEventParser)))
  }

  public subscribeToMediaDeleted(onDeleted: (event: MediaDeletedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(MediaEventType.MEDIA_DELETED, this.createEventValidatingConsumer(onDeleted, this.mediaEventParser.parseMediaDeletedEvent.bind(this.mediaEventParser)))
  }

  private createEventValidatingConsumer<T>(consumer: (event: T) => void, parser: (maybeEvent: unknown) => T): EventConsumer {
    return (event: TypedEvent) => {
      try {
        const mediaEvent: T = parser(event)
        consumer(mediaEvent)
      } catch (error) {
        this.logger.data({ error, event }).error('Failed to parse Media event.')
      }
    }
  }
}
