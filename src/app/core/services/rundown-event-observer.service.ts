import { EventConsumer, EventObserver, EventSubscription, TypedEvent } from '../../event-system/abstractions/event-observer.service'
import { Injectable } from '@angular/core'
import { RundownEventParser } from '../abstractions/rundown-event.parser'
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
  AutoNextStartedEvent,
  SegmentUpdatedEvent,
  RundownRehearseEvent,
} from '../models/rundown-event'
import { Logger } from '../abstractions/logger.service'

@Injectable()
export class RundownEventObserver {
  private readonly logger: Logger

  constructor(
    private readonly eventObserver: EventObserver,
    private readonly rundownEventParser: RundownEventParser,
    logger: Logger
  ) {
    this.logger = logger.tag('RundownEventObserver')
  }

  public subscribeToRundownActivation(onActivated: (event: RundownActivatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(RundownEventType.ACTIVATED, this.createEventValidatingConsumer(onActivated, this.rundownEventParser.parseRundownActivatedEvent.bind(this.rundownEventParser)))
  }

  public subscribeToRundownRehearsal(onActivated: (event: RundownRehearseEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(RundownEventType.REHEARSE, this.createEventValidatingConsumer(onActivated, this.rundownEventParser.parseRundownRehearseEvent.bind(this.rundownEventParser)))
  }

  public subscribeToRundownDeactivation(onDeactivated: (event: RundownDeactivatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.DEACTIVATED,
      this.createEventValidatingConsumer(onDeactivated, this.rundownEventParser.parseRundownDeactivatedEvent.bind(this.rundownEventParser))
    )
  }

  public subscribeToRundownReset(onReset: (event: RundownResetEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(RundownEventType.RESET, this.createEventValidatingConsumer(onReset, this.rundownEventParser.parseRundownResetEvent.bind(this.rundownEventParser)))
  }

  public subscribeToRundownTake(onTaken: (event: PartTakenEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(RundownEventType.TAKEN, this.createEventValidatingConsumer(onTaken, this.rundownEventParser.parseTakenEvent.bind(this.rundownEventParser)))
  }

  public subscribeToRundownAutoNext(onAutoNextStarted: (event: AutoNextStartedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.AUTO_NEXT_STARTED,
      this.createEventValidatingConsumer(onAutoNextStarted, this.rundownEventParser.parseAutoNextStartedEvent.bind(this.rundownEventParser))
    )
  }

  public subscribeToRundownSetNext(onSetNext: (event: PartSetAsNextEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(RundownEventType.SET_NEXT, this.createEventValidatingConsumer(onSetNext, this.rundownEventParser.parseSetNextEvent.bind(this.rundownEventParser)))
  }

  public subscribeToRundownInfinitePiecesUpdated(onInfinitePiecesUpdated: (event: RundownInfinitePiecesUpdatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.INFINITE_PIECES_UPDATED,
      this.createEventValidatingConsumer(onInfinitePiecesUpdated, this.rundownEventParser.parseInfinitePiecesUpdatedEvent.bind(this.rundownEventParser))
    )
  }

  public subscribeToRundownPartInsertedAsOnAir(onPartInsertedAsOnAir: (event: RundownPartInsertedAsOnAirEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.PART_INSERTED_AS_ON_AIR,
      this.createEventValidatingConsumer(onPartInsertedAsOnAir, this.rundownEventParser.parsePartInsertedAsOnAirEvent.bind(this.rundownEventParser))
    )
  }

  public subscribeToRundownPartInsertedAsNext(onPartInsertedAsNext: (event: RundownPartInsertedAsNextEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.PART_INSERTED_AS_NEXT,
      this.createEventValidatingConsumer(onPartInsertedAsNext, this.rundownEventParser.parsePartInsertedAsNextEvent.bind(this.rundownEventParser))
    )
  }

  public subscribeToRundownPieceInserted(onPieceInserted: (event: RundownPieceInsertedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.PIECE_INSERTED,
      this.createEventValidatingConsumer(onPieceInserted, this.rundownEventParser.parsePieceInsertedEvent.bind(this.rundownEventParser))
    )
  }

  public subscribeToRundownCreation(onRundownCreated: (event: RundownCreatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.RUNDOWN_CREATED,
      this.createEventValidatingConsumer(onRundownCreated, this.rundownEventParser.parseRundownCreatedEvent.bind(this.rundownEventParser))
    )
  }

  public subscribeToRundownUpdates(onRundownCreated: (event: RundownUpdatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.RUNDOWN_UPDATED,
      this.createEventValidatingConsumer(onRundownCreated, this.rundownEventParser.parseRundownUpdatedEvent.bind(this.rundownEventParser))
    )
  }

  public subscribeToRundownDeletion(onDeleted: (event: RundownDeletedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(RundownEventType.RUNDOWN_DELETED, this.createEventValidatingConsumer(onDeleted, this.rundownEventParser.parseRundownDeletedEvent.bind(this.rundownEventParser)))
  }

  public subscribeToSegmentCreation(onSegmentCreated: (event: SegmentCreatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.SEGMENT_CREATED,
      this.createEventValidatingConsumer(onSegmentCreated, this.rundownEventParser.parseSegmentCreatedEvent.bind(this.rundownEventParser))
    )
  }

  public subscribeToSegmentUpdates(onSegmentUpdated: (event: SegmentUpdatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.SEGMENT_UPDATED,
      this.createEventValidatingConsumer(onSegmentUpdated, this.rundownEventParser.parseSegmentUpdatedEvent.bind(this.rundownEventParser))
    )
  }

  public subscribeToSegmentDeletion(onSegmentDeleted: (event: SegmentDeletedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.SEGMENT_DELETED,
      this.createEventValidatingConsumer(onSegmentDeleted, this.rundownEventParser.parseSegmentDeletedEvent.bind(this.rundownEventParser))
    )
  }

  public subscribeToSegmentUnsync(onSegmentUnsync: (event: SegmentUnsyncedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.SEGMENT_UNSYNCED,
      this.createEventValidatingConsumer(onSegmentUnsync, this.rundownEventParser.parseSegmentUnsyncedEvent.bind(this.rundownEventParser))
    )
  }

  public subscribeToPartCreation(onPartCreated: (event: PartCreatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(RundownEventType.PART_CREATED, this.createEventValidatingConsumer(onPartCreated, this.rundownEventParser.parsePartCreatedEvent.bind(this.rundownEventParser)))
  }

  public subscribeToPartUpdates(onPartUpdated: (event: PartUpdatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(RundownEventType.PART_UPDATED, this.createEventValidatingConsumer(onPartUpdated, this.rundownEventParser.parsePartUpdatedEvent.bind(this.rundownEventParser)))
  }

  public subscribeToPartDeletion(onPartDeleted: (event: PartDeletedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(RundownEventType.PART_DELETED, this.createEventValidatingConsumer(onPartDeleted, this.rundownEventParser.parsePartDeletedEvent.bind(this.rundownEventParser)))
  }

  public subscribeToPartUnsynced(onPartUnsynced: (event: PartUnsyncedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.PART_UNSYNCED,
      this.createEventValidatingConsumer(onPartUnsynced, this.rundownEventParser.parsePartUnsyncedEvent.bind(this.rundownEventParser))
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
