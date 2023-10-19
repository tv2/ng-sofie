import { EventConsumer, EventObserver, TypedEvent, EventSubscription } from '../../event-system/abstractions/event-observer.service'
import { Injectable } from '@angular/core'
import { RundownEventParser } from '../abstractions/rundown-event.parser'
import { RundownEventType } from '../models/rundown-event-type'
import {
    RundownActivatedEvent,
    RundownDeactivatedEvent,
    RundownDeletedEvent,
    RundownInfinitePieceAddedEvent,
    RundownResetEvent,
    PartSetAsNextEvent,
    PartTakenEvent,
    SegmentCreatedEvent,
    SegmentDeletedEvent,
    PartCreatedEvent,
    PartDeletedEvent,
    PartUpdatedEvent,
    SegmentUpdatedEvent,
    RundownCreatedEvent, RundownUpdatedEvent
} from '../models/rundown-event'

@Injectable()
export class RundownEventObserver {
  constructor(
    private readonly eventObserver: EventObserver,
    private readonly rundownEventParser: RundownEventParser
  ) {}

  public subscribeToRundownActivation(onActivated: (event: RundownActivatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(RundownEventType.ACTIVATED, this.createEventValidatingConsumer(onActivated, this.rundownEventParser.parseActivatedEvent.bind(this.rundownEventParser)))
  }

  public subscribeToRundownDeactivation(onDeactivated: (event: RundownDeactivatedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(RundownEventType.DEACTIVATED, this.createEventValidatingConsumer(onDeactivated, this.rundownEventParser.parseDeactivatedEvent.bind(this.rundownEventParser)))
  }

  public subscribeToRundownReset(onReset: (event: RundownResetEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(RundownEventType.RESET, this.createEventValidatingConsumer(onReset, this.rundownEventParser.parseResetEvent.bind(this.rundownEventParser)))
  }

  public subscribeToRundownTake(onTaken: (event: PartTakenEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(RundownEventType.TAKEN, this.createEventValidatingConsumer(onTaken, this.rundownEventParser.parseTakenEvent.bind(this.rundownEventParser)))
  }

  public subscribeToRundownSetNext(onSetNext: (event: PartSetAsNextEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(RundownEventType.SET_NEXT, this.createEventValidatingConsumer(onSetNext, this.rundownEventParser.parseSetNextEvent.bind(this.rundownEventParser)))
  }

  public subscribeToRundownInfinitePieceAdded(onInfinitePieceAdded: (event: RundownInfinitePieceAddedEvent) => void): EventSubscription {
    return this.eventObserver.subscribe(
      RundownEventType.INFINITE_PIECE_ADDED,
      this.createEventValidatingConsumer(onInfinitePieceAdded, this.rundownEventParser.parseInfinitePieceAdded.bind(this.rundownEventParser))
    )
  }

  public subscribeToRundownCreated(onCreated: (event: RundownCreatedEvent) => void): EventSubscription {
      return this.eventObserver.subscribe(
          RundownEventType.RUNDOWN_CREATED,
          this.createEventValidatingConsumer(onCreated, this.rundownEventParser.parseRundownCreatedEvent.bind(this.rundownEventParser))
      )
  }

    public subscribeToRundownUpdated(onUpdated: (event: RundownUpdatedEvent) => void): EventSubscription {
        return this.eventObserver.subscribe(
            RundownEventType.RUNDOWN_UPDATED,
            this.createEventValidatingConsumer(onUpdated, this.rundownEventParser.parseRundownUpdatedEvent.bind(this.rundownEventParser))
        )
    }

  public subscribeToRundownDeletion(onDeleted: (event: RundownDeletedEvent) => void): EventSubscription {
      return this.eventObserver.subscribe(
          RundownEventType.RUNDOWN_DELETED,
          this.createEventValidatingConsumer(onDeleted, this.rundownEventParser.parseRundownDeletedEvent.bind(this.rundownEventParser))
      )
  }

  public subscribeToSegmentCreated(onSegmentCreated: (event: SegmentCreatedEvent) => void): EventSubscription {
        return this.eventObserver.subscribe(
            RundownEventType.SEGMENT_CREATED,
            this.createEventValidatingConsumer(onSegmentCreated, this.rundownEventParser.parseSegmentCreatedEvent.bind(this.rundownEventParser))
        )
    }

    public subscribeToSegmentUpdated(onSegmentUpdated: (event: SegmentUpdatedEvent) => void): EventSubscription {
        return this.eventObserver.subscribe(
            RundownEventType.SEGMENT_UPDATED,
            this.createEventValidatingConsumer(onSegmentUpdated, this.rundownEventParser.parseSegmentUpdatedEvent.bind(this.rundownEventParser))
        )
    }

    public subscribeToSegmentDeleted(onSegmentDeleted: (event: SegmentDeletedEvent) => void): EventSubscription {
        return this.eventObserver.subscribe(
            RundownEventType.SEGMENT_DELETED,
            this.createEventValidatingConsumer(onSegmentDeleted, this.rundownEventParser.parseSegmentDeletedEvent.bind(this.rundownEventParser))
        )
    }

    public subscribeToPartCreated(onPartCreated: (event: PartCreatedEvent) => void): EventSubscription {
        return this.eventObserver.subscribe(
            RundownEventType.PART_CREATED,
            this.createEventValidatingConsumer(onPartCreated, this.rundownEventParser.parsePartCreatedEvent.bind(this.rundownEventParser))
        )
    }

    public subscribeToPartUpdated(onPartUpdated: (event: PartUpdatedEvent) => void): EventSubscription {
        return this.eventObserver.subscribe(
            RundownEventType.PART_UPDATED,
            this.createEventValidatingConsumer(onPartUpdated, this.rundownEventParser.parsePartUpdatedEvent.bind(this.rundownEventParser))
        )
    }

    public subscribeToPartDeleted(onPartDeleted: (event: PartDeletedEvent) => void): EventSubscription {
        return this.eventObserver.subscribe(
            RundownEventType.PART_DELETED,
            this.createEventValidatingConsumer(onPartDeleted, this.rundownEventParser.parsePartDeletedEvent.bind(this.rundownEventParser))
        )
    }private createEventValidatingConsumer<T>(consumer: (event: T) => void, parser: (maybeEvent: unknown) => T): EventConsumer {
    return (event: TypedEvent) => {
      try {
        const activationEvent: T = parser(event)
        consumer(activationEvent)
      } catch (error) {
        console.error('Failed to parse activation event', error, event)
      }
    }
  }
}
