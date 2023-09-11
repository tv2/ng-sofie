import { EventConsumer, EventObserver, TypedEvent, EventSubscription } from '../../event-system/abstractions/event-observer.service'
import { Injectable } from '@angular/core'
import { RundownEventParser } from '../abstractions/rundown-event.parser'
import { RundownEventType } from '../models/rundown-event-type'
import {
    RundownActivatedEvent, RundownAdLibPieceInsertedEvent,
    RundownDeactivatedEvent, RundownDeletedEvent, RundownInfinitePieceAddedEvent,
    RundownResetEvent, PartSetAsNextEvent,
    PartTakenEvent
} from '../models/rundown-event'

@Injectable()
export class RundownEventObserver {
    constructor(private readonly eventObserver: EventObserver, private readonly rundownEventParser: RundownEventParser) {}

    public subscribeToRundownActivation(consumer: (event: RundownActivatedEvent) => void): EventSubscription {
        return this.eventObserver.subscribe(
            RundownEventType.ACTIVATED,
            this.createEventValidatingConsumer(consumer, this.rundownEventParser.parseActivatedEvent.bind(this.rundownEventParser))
        )
    }

    public subscribeToRundownDeactivation(consumer: (event: RundownDeactivatedEvent) => void): EventSubscription {
        return this.eventObserver.subscribe(
            RundownEventType.DEACTIVATED,
            this.createEventValidatingConsumer(consumer, this.rundownEventParser.parseDeactivatedEvent.bind(this.rundownEventParser))
        )
    }

    public subscribeToRundownDeletion(consumer: (event: RundownDeletedEvent) => void): EventSubscription {
        return this.eventObserver.subscribe(
            RundownEventType.DELETED,
            this.createEventValidatingConsumer(consumer, this.rundownEventParser.parseDeletedEvent.bind(this.rundownEventParser))
        )
    }

    public subscribeToRundownReset(consumer: (event: RundownResetEvent) => void): EventSubscription {
        return this.eventObserver.subscribe(
            RundownEventType.RESET,
            this.createEventValidatingConsumer(consumer, this.rundownEventParser.parseResetEvent.bind(this.rundownEventParser))
        )
    }

    public subscribeToRundownTake(consumer: (event: PartTakenEvent) => void): EventSubscription {
        return this.eventObserver.subscribe(
            RundownEventType.TAKEN,
            this.createEventValidatingConsumer(consumer, this.rundownEventParser.parseTakenEvent.bind(this.rundownEventParser))
        )
    }

    public subscribeToRundownSetNext(consumer: (event: PartSetAsNextEvent) => void): EventSubscription {
        return this.eventObserver.subscribe(
            RundownEventType.SET_NEXT,
            this.createEventValidatingConsumer(consumer, this.rundownEventParser.parseSetNextEvent.bind(this.rundownEventParser))
        )
    }

    public subscribeToRundownAdLibPieceInserted(consumer: (event: RundownAdLibPieceInsertedEvent) => void): EventSubscription {
        return this.eventObserver.subscribe(
            RundownEventType.AD_LIB_PIECE_INSERTED,
            this.createEventValidatingConsumer(consumer, this.rundownEventParser.parseAdLibPieceInserted.bind(this.rundownEventParser))
        )
    }

    public subscribeToRundownInfinitePieceAdded(consumer: (event: RundownInfinitePieceAddedEvent) => void): EventSubscription {
        return this.eventObserver.subscribe(
            RundownEventType.INFINITE_PIECE_ADDED,
            this.createEventValidatingConsumer(consumer, this.rundownEventParser.parseInfinitePieceAdded.bind(this.rundownEventParser))
        )
    }

    private createEventValidatingConsumer<T>(consumer: (event: T) => void, parser: (maybeEvent: unknown) => T): EventConsumer {
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
