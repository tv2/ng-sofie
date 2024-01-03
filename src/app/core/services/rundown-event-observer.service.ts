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
    private readonly rundownEventParser: RundownEventValidator,
    logger: Logger
  ) {
    this.logger = logger.tag('RundownEventObserver')
  }

  public subscribeToRundownActivation(onActivated: (event: RundownActivatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.ACTIVATED,
      this.createEventValidatingConsumer(onActivated, this.rundownEventParser.validateRundownActivatedEvent.bind(this.rundownEventParser))
    )
  }

  public subscribeToRundownDeactivation(onDeactivated: (event: RundownDeactivatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.DEACTIVATED,
      this.createEventValidatingConsumer(onDeactivated, this.rundownEventParser.validateRundownDeactivatedEvent.bind(this.rundownEventParser))
    )
  }

  public subscribeToRundownReset(onReset: (event: RundownResetEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(RundownEventType.RESET, this.createEventValidatingConsumer(onReset, this.rundownEventParser.validateRundownResetEvent.bind(this.rundownEventParser)))
  }

  public subscribeToRundownTake(onTaken: (event: PartTakenEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(RundownEventType.TAKEN, this.createEventValidatingConsumer(onTaken, this.rundownEventParser.validateTakenEvent.bind(this.rundownEventParser)))
  }

  public subscribeToRundownSetNext(onSetNext: (event: PartSetAsNextEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(RundownEventType.SET_NEXT, this.createEventValidatingConsumer(onSetNext, this.rundownEventParser.validateSetNextEvent.bind(this.rundownEventParser)))
  }

  public subscribeToRundownInfinitePiecesUpdated(onInfinitePiecesUpdated: (event: RundownInfinitePiecesUpdatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.INFINITE_PIECES_UPDATED,
      this.createEventValidatingConsumer(onInfinitePiecesUpdated, this.rundownEventParser.validateInfinitePiecesUpdatedEvent.bind(this.rundownEventParser))
    )
  }

  public subscribeToRundownPartInsertedAsOnAir(onPartInsertedAsOnAir: (event: RundownPartInsertedAsOnAirEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.PART_INSERTED_AS_ON_AIR,
      this.createEventValidatingConsumer(onPartInsertedAsOnAir, this.rundownEventParser.validatePartInsertedAsOnAirEvent.bind(this.rundownEventParser))
    )
  }

  public subscribeToRundownPartInsertedAsNext(onPartInsertedAsNext: (event: RundownPartInsertedAsNextEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.PART_INSERTED_AS_NEXT,
      this.createEventValidatingConsumer(onPartInsertedAsNext, this.rundownEventParser.validatePartInsertedAsNextEvent.bind(this.rundownEventParser))
    )
  }

  public subscribeToRundownPieceInserted(onPieceInserted: (event: RundownPieceInsertedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.PIECE_INSERTED,
      this.createEventValidatingConsumer(onPieceInserted, this.rundownEventParser.validatePieceInsertedEvent.bind(this.rundownEventParser))
    )
  }

  public subscribeToRundownCreation(onRundownCreated: (event: RundownCreatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.RUNDOWN_CREATED,
      this.createEventValidatingConsumer(onRundownCreated, this.rundownEventParser.validateRundownCreatedEvent.bind(this.rundownEventParser))
    )
  }

  public subscribeToRundownUpdates(onRundownCreated: (event: RundownUpdatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.RUNDOWN_UPDATED,
      this.createEventValidatingConsumer(onRundownCreated, this.rundownEventParser.validateRundownUpdatedEvent.bind(this.rundownEventParser))
    )
  }

  public subscribeToRundownDeletion(onDeleted: (event: RundownDeletedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.RUNDOWN_DELETED,
      this.createEventValidatingConsumer(onDeleted, this.rundownEventParser.validateRundownDeletedEvent.bind(this.rundownEventParser))
    )
  }

  public subscribeToSegmentCreation(onSegmentCreated: (event: SegmentCreatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.SEGMENT_CREATED,
      this.createEventValidatingConsumer(onSegmentCreated, this.rundownEventParser.validateSegmentCreatedEvent.bind(this.rundownEventParser))
    )
  }

  public subscribeToSegmentUpdates(onSegmentUpdated: (event: SegmentUpdatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.SEGMENT_UPDATED,
      this.createEventValidatingConsumer(onSegmentUpdated, this.rundownEventParser.validateSegmentUpdatedEvent.bind(this.rundownEventParser))
    )
  }

  public subscribeToSegmentDeletion(onSegmentDeleted: (event: SegmentDeletedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.SEGMENT_DELETED,
      this.createEventValidatingConsumer(onSegmentDeleted, this.rundownEventParser.validateSegmentDeletedEvent.bind(this.rundownEventParser))
    )
  }

  public subscribeToSegmentUnsync(onSegmentUnsync: (event: SegmentUnsyncedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.SEGMENT_UNSYNCED,
      this.createEventValidatingConsumer(onSegmentUnsync, this.rundownEventParser.validateSegmentUnsyncedEvent.bind(this.rundownEventParser))
    )
  }

  public subscribeToPartCreation(onPartCreated: (event: PartCreatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.PART_CREATED,
      this.createEventValidatingConsumer(onPartCreated, this.rundownEventParser.validatePartCreatedEvent.bind(this.rundownEventParser))
    )
  }

  public subscribeToPartUpdates(onPartUpdated: (event: PartUpdatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.PART_UPDATED,
      this.createEventValidatingConsumer(onPartUpdated, this.rundownEventParser.validatePartUpdatedEvent.bind(this.rundownEventParser))
    )
  }

  public subscribeToPartDeletion(onPartDeleted: (event: PartDeletedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.PART_DELETED,
      this.createEventValidatingConsumer(onPartDeleted, this.rundownEventParser.validatePartDeletedEvent.bind(this.rundownEventParser))
    )
  }

  public subscribeToPartUnsynced(onPartUnsynced: (event: PartUnsyncedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.PART_UNSYNCED,
      this.createEventValidatingConsumer(onPartUnsynced, this.rundownEventParser.validatePartUnsyncedEvent.bind(this.rundownEventParser))
    )
  }

  private createEventValidatingConsumer<T>(consumer: (event: T) => void, parser: (maybeEvent: unknown) => T): EventConsumer {
    return (event: TypedEvent) => {
      try {
        const activationEvent: T = parser(event)
        consumer(activationEvent)
      } catch (error) {
        this.logger.data({ error, event }).error('Failed to parse Rundown event.')
      }
    }
  }
}
