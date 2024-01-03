import { EventConsumer, EventObserver, EventSubscription, TypedEvent } from '../../event-system/abstractions/event-observer.service'
import { Injectable } from '@angular/core'
import { RundownEventValidator } from '../abstractions/rundown-event-validator.service'
import { RundownEventType } from '../models/rundown-event-type'
import {
  PartCreatedEvent,
  PartDeletedEvent,
  PartSetAsNextEvent,
  PartTakenEvent,
  PartUnsyncedEvent,
  PartUpdatedEvent,
  RundownActivatedEvent,
  RundownCreatedEvent,
  RundownDeactivatedEvent,
  RundownDeletedEvent,
  RundownInfinitePiecesUpdatedEvent,
  RundownResetEvent,
  RundownPartInsertedAsOnAirEvent,
  RundownPartInsertedAsNextEvent,
  RundownPieceInsertedEvent,
  RundownUpdatedEvent,
  SegmentCreatedEvent,
  SegmentDeletedEvent,
  SegmentUnsyncedEvent,
  SegmentUpdatedEvent,
} from '../models/rundown-event'
import { Logger } from '../abstractions/logger.service'

@Injectable()
export class RundownEventObserver {
  private readonly logger: Logger

  constructor(
    private readonly eventObserver: EventObserver,
    private readonly rundownEventValidator: RundownEventValidator,
    logger: Logger
  ) {
    this.logger = logger.tag('RundownEventObserver')
  }

  public subscribeToRundownActivation(onActivated: (event: RundownActivatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.ACTIVATED,
      this.createEventValidatingConsumer(onActivated, this.rundownEventValidator.validateRundownActivatedEvent.bind(this.rundownEventValidator))
    )
  }

  public subscribeToRundownDeactivation(onDeactivated: (event: RundownDeactivatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.DEACTIVATED,
      this.createEventValidatingConsumer(onDeactivated, this.rundownEventValidator.validateRundownDeactivatedEvent.bind(this.rundownEventValidator))
    )
  }

  public subscribeToRundownReset(onReset: (event: RundownResetEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(RundownEventType.RESET, this.createEventValidatingConsumer(onReset, this.rundownEventValidator.validateRundownResetEvent.bind(this.rundownEventValidator)))
  }

  public subscribeToRundownTake(onTaken: (event: PartTakenEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(RundownEventType.TAKEN, this.createEventValidatingConsumer(onTaken, this.rundownEventValidator.validateTakenEvent.bind(this.rundownEventValidator)))
  }

  public subscribeToRundownSetNext(onSetNext: (event: PartSetAsNextEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(RundownEventType.SET_NEXT, this.createEventValidatingConsumer(onSetNext, this.rundownEventValidator.validateSetNextEvent.bind(this.rundownEventValidator)))
  }

  public subscribeToRundownInfinitePiecesUpdated(onInfinitePiecesUpdated: (event: RundownInfinitePiecesUpdatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.INFINITE_PIECES_UPDATED,
      this.createEventValidatingConsumer(onInfinitePiecesUpdated, this.rundownEventValidator.validateInfinitePiecesUpdatedEvent.bind(this.rundownEventValidator))
    )
  }

  public subscribeToRundownPartInsertedAsOnAir(onPartInsertedAsOnAir: (event: RundownPartInsertedAsOnAirEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.PART_INSERTED_AS_ON_AIR,
      this.createEventValidatingConsumer(onPartInsertedAsOnAir, this.rundownEventValidator.validatePartInsertedAsOnAirEvent.bind(this.rundownEventValidator))
    )
  }

  public subscribeToRundownPartInsertedAsNext(onPartInsertedAsNext: (event: RundownPartInsertedAsNextEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.PART_INSERTED_AS_NEXT,
      this.createEventValidatingConsumer(onPartInsertedAsNext, this.rundownEventValidator.validatePartInsertedAsNextEvent.bind(this.rundownEventValidator))
    )
  }

  public subscribeToRundownPieceInserted(onPieceInserted: (event: RundownPieceInsertedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.PIECE_INSERTED,
      this.createEventValidatingConsumer(onPieceInserted, this.rundownEventValidator.validatePieceInsertedEvent.bind(this.rundownEventValidator))
    )
  }

  public subscribeToRundownCreation(onRundownCreated: (event: RundownCreatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.RUNDOWN_CREATED,
      this.createEventValidatingConsumer(onRundownCreated, this.rundownEventValidator.validateRundownCreatedEvent.bind(this.rundownEventValidator))
    )
  }

  public subscribeToRundownUpdates(onRundownCreated: (event: RundownUpdatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.RUNDOWN_UPDATED,
      this.createEventValidatingConsumer(onRundownCreated, this.rundownEventValidator.validateRundownUpdatedEvent.bind(this.rundownEventValidator))
    )
  }

  public subscribeToRundownDeletion(onDeleted: (event: RundownDeletedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.RUNDOWN_DELETED,
      this.createEventValidatingConsumer(onDeleted, this.rundownEventValidator.validateRundownDeletedEvent.bind(this.rundownEventValidator))
    )
  }

  public subscribeToSegmentCreation(onSegmentCreated: (event: SegmentCreatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.SEGMENT_CREATED,
      this.createEventValidatingConsumer(onSegmentCreated, this.rundownEventValidator.validateSegmentCreatedEvent.bind(this.rundownEventValidator))
    )
  }

  public subscribeToSegmentUpdates(onSegmentUpdated: (event: SegmentUpdatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.SEGMENT_UPDATED,
      this.createEventValidatingConsumer(onSegmentUpdated, this.rundownEventValidator.validateSegmentUpdatedEvent.bind(this.rundownEventValidator))
    )
  }

  public subscribeToSegmentDeletion(onSegmentDeleted: (event: SegmentDeletedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.SEGMENT_DELETED,
      this.createEventValidatingConsumer(onSegmentDeleted, this.rundownEventValidator.validateSegmentDeletedEvent.bind(this.rundownEventValidator))
    )
  }

  public subscribeToSegmentUnsync(onSegmentUnsync: (event: SegmentUnsyncedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.SEGMENT_UNSYNCED,
      this.createEventValidatingConsumer(onSegmentUnsync, this.rundownEventValidator.validateSegmentUnsyncedEvent.bind(this.rundownEventValidator))
    )
  }

  public subscribeToPartCreation(onPartCreated: (event: PartCreatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.PART_CREATED,
      this.createEventValidatingConsumer(onPartCreated, this.rundownEventValidator.validatePartCreatedEvent.bind(this.rundownEventValidator))
    )
  }

  public subscribeToPartUpdates(onPartUpdated: (event: PartUpdatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.PART_UPDATED,
      this.createEventValidatingConsumer(onPartUpdated, this.rundownEventValidator.validatePartUpdatedEvent.bind(this.rundownEventValidator))
    )
  }

  public subscribeToPartDeletion(onPartDeleted: (event: PartDeletedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.PART_DELETED,
      this.createEventValidatingConsumer(onPartDeleted, this.rundownEventValidator.validatePartDeletedEvent.bind(this.rundownEventValidator))
    )
  }

  public subscribeToPartUnsynced(onPartUnsynced: (event: PartUnsyncedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.PART_UNSYNCED,
      this.createEventValidatingConsumer(onPartUnsynced, this.rundownEventValidator.validatePartUnsyncedEvent.bind(this.rundownEventValidator))
    )
  }

  private createEventValidatingConsumer<T>(consumer: (event: T) => void, validator: (maybeEvent: unknown) => T): EventConsumer {
    return (event: TypedEvent) => {
      try {
        const activationEvent: T = validator(event)
        consumer(activationEvent)
      } catch (error) {
        this.logger.data({ error, event }).error('Failed to parse Rundown event.')
      }
    }
  }
}
