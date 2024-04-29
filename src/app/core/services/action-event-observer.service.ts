import { Injectable } from '@angular/core'
import { Logger } from '../abstractions/logger.service'
import { EventConsumer, EventObserver, EventSubscription, TypedEvent } from '../../event-system/abstractions/event-observer.service'
import { ActionEventParser } from '../abstractions/action-event-parser'
import { ActionsUpdatedEvent } from '../models/action-event'
import { ActionEventType } from '../models/action-event-type'

@Injectable()
export class ActionEventObserver {
  private readonly logger: Logger

  constructor(
    private readonly eventObserver: EventObserver,
    private readonly actionEventParser: ActionEventParser,
    logger: Logger
  ) {
    this.logger = logger.tag('ActionEventObserver')
  }

  public subscribeToActionsUpdated(onUpdated: (event: ActionsUpdatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(ActionEventType.ACTIONS_UPDATED, this.createEventValidatingConsumer(onUpdated, this.actionEventParser.parseActionsUpdatedEvent.bind(this.actionEventParser)))
  }

  private createEventValidatingConsumer<T>(consumer: (event: T) => void, parser: (maybeEvent: unknown) => T): EventConsumer {
    return (event: TypedEvent) => {
      try {
        const activationEvent: T = parser(event)
        consumer(activationEvent)
      } catch (error) {
        this.logger.data({ error, event }).error('Failed to parse ActionTrigger event.')
      }
    }
  }
}
