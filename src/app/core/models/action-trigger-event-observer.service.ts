import { Injectable } from '@angular/core'
import { EventConsumer, EventObserver, EventSubscription, TypedEvent } from '../../event-system/abstractions/event-observer.service'
import { ActionTriggerEventType } from './action-trigger-event-type'
import { ActionTriggerEventValidator } from '../abstractions/action-trigger-event-validator.service'
import { Logger } from '../abstractions/logger.service'
import { ActionTriggerCreatedEvent, ActionTriggerDeletedEvent, ActionTriggerUpdatedEvent } from './action-trigger-event'

@Injectable()
export class ActionTriggerEventObserver {
  private readonly logger: Logger

  constructor(
    private readonly eventObserver: EventObserver,
    private readonly actionTriggerEventParser: ActionTriggerEventValidator,
    logger: Logger
  ) {
    this.logger = logger.tag('ActionTriggerEventObserver')
  }

  public subscribeToActionTriggerCreated(onCreated: (event: ActionTriggerCreatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      ActionTriggerEventType.ACTION_TRIGGER_CREATED,
      this.createEventValidatingConsumer(onCreated, this.actionTriggerEventParser.parseActionTriggerCreatedEvent.bind(this.actionTriggerEventParser))
    )
  }

  public subscribeToActionTriggerUpdated(onUpdated: (event: ActionTriggerUpdatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      ActionTriggerEventType.ACTION_TRIGGER_UPDATED,
      this.createEventValidatingConsumer(onUpdated, this.actionTriggerEventParser.parseActionTriggerUpdatedEvent.bind(this.actionTriggerEventParser))
    )
  }

  public subscribeToActionTriggerDeleted(onDeleted: (event: ActionTriggerDeletedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      ActionTriggerEventType.ACTION_TRIGGER_DELETED,
      this.createEventValidatingConsumer(onDeleted, this.actionTriggerEventParser.parseActionTriggerDeletedEvent.bind(this.actionTriggerEventParser))
    )
  }

  private createEventValidatingConsumer<T>(consumer: (event: T) => void, validator: (maybeEvent: unknown) => T): EventConsumer {
    return (event: TypedEvent) => {
      try {
        const activationEvent: T = validator(event)
        consumer(activationEvent)
      } catch (error) {
        this.logger.data({ error, event }).error('Failed to parse ActionTrigger event.')
      }
    }
  }
}
