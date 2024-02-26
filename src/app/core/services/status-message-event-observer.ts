import { Injectable } from '@angular/core'
import { Logger } from '../abstractions/logger.service'
import {
  EventConsumer,
  EventObserver,
  EventSubscription,
  TypedEvent
} from '../../event-system/abstractions/event-observer.service'
import { StatusMessageEventType } from '../models/status-message-event-type'
import { StatusMessageEventParser } from '../abstractions/status-message-event-parser'
import { StatusMessageEvent } from '../models/status-message-event'

@Injectable()
export class StatusMessageEventObserver {
  private readonly logger: Logger

  constructor(
    private readonly eventObserver: EventObserver,
    private readonly statueMessageEventParser: StatusMessageEventParser,
    logger: Logger
  ) {
    this.logger = logger.tag('StatusMessageEventObserver')
  }

  public subscribeToStatusMessageEvents(eventCallback: (event: StatusMessageEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      StatusMessageEventType.STATUS_MESSAGE,
      this.createEventValidatingConsumer(eventCallback, this.statueMessageEventParser.parseStatusMessageEvent.bind(this.statueMessageEventParser))
    )
  }

  private createEventValidatingConsumer<T>(consumer: (event: T) => void, parser: (maybeEvent: unknown) => T): EventConsumer {
    return (event: TypedEvent) => {
      try {
        const mediaEvent: T = parser(event)
        consumer(mediaEvent)
      } catch (error) {
        this.logger.data({ error, event }).error('Failed to parse StatusMessage event.')
      }
    }
  }
}
