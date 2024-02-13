import { Injectable } from '@angular/core'
import { EventConsumer, EventObserver, EventSubscription, TypedEvent } from '../../event-system/abstractions/event-observer.service'
import { ConfigurationParser } from '../../shared/abstractions/configuration-parser.service'
import { ShelfConfigurationUpdatedEvent } from '../models/configuration-event'
import { ConfigurationEventType } from '../models/configuration-event-type'
import { ConfigurationEventParser } from '../abstractions/configuration-event-parser'
import { Logger } from '../abstractions/logger.service'

@Injectable()
export class ConfigurationEventObserver {
  private readonly logger: Logger

  constructor(
    private readonly eventObserver: EventObserver,
    private readonly configurationEventParser: ConfigurationEventParser,
    logger: Logger
  ) {
    this.logger = logger.tag(ConfigurationParser.name)
  }

  public subscribeToShelfUpdated(onUpdated: (event: ShelfConfigurationUpdatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      ConfigurationEventType.SHELF_CONFIGURATION_UPDATED,
      this.createEventValidatingConsumer(onUpdated, this.configurationEventParser.parseShelfConfigurationUpdatedEvent.bind(this.configurationEventParser))
    )
  }

  private createEventValidatingConsumer<T>(consumer: (event: T) => void, parser: (maybeEvent: unknown) => T): EventConsumer {
    return (event: TypedEvent) => {
      try {
        const activationEvent: T = parser(event)
        consumer(activationEvent)
      } catch (error) {
        this.logger.data({ error, event }).error('Failed to parse Configuration event.')
      }
    }
  }
}
