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
    PartTakenEvent
} from '../models/rundown-event'

@Injectable()
export class RundownEventObserver {
    constructor(private readonly eventObserver: EventObserver, private readonly rundownEventParser: RundownEventParser) {}

    public subscribeToRundownActivation(onActivated: (event: RundownActivatedEvent) => void): EventSubscription {
        return this.eventObserver.subscribe(
            RundownEventType.ACTIVATED,
            this.createEventValidatingConsumer(onActivated, this.rundownEventParser.parseActivatedEvent.bind(this.rundownEventParser))
        )
    }

    public subscribeToRundownDeactivation(onDeactivated: (event: RundownDeactivatedEvent) => void): EventSubscription {
        return this.eventObserver.subscribe(
            RundownEventType.DEACTIVATED,
            this.createEventValidatingConsumer(onDeactivated, this.rundownEventParser.parseDeactivatedEvent.bind(this.rundownEventParser))
        )
    }

    public subscribeToRundownDeletion(onDeleted: (event: RundownDeletedEvent) => void): EventSubscription {
        return this.eventObserver.subscribe(
            RundownEventType.DELETED,
            this.createEventValidatingConsumer(onDeleted, this.rundownEventParser.parseDeletedEvent.bind(this.rundownEventParser))
        )
    }

    public subscribeToRundownReset(onReset: (event: RundownResetEvent) => void): EventSubscription {
        return this.eventObserver.subscribe(
            RundownEventType.RESET,
            this.createEventValidatingConsumer(onReset, this.rundownEventParser.parseResetEvent.bind(this.rundownEventParser))
        )
    }

    public subscribeToRundownTake(onTaken: (event: PartTakenEvent) => void): EventSubscription {
        return this.eventObserver.subscribe(
            RundownEventType.TAKEN,
            this.createEventValidatingConsumer(onTaken, this.rundownEventParser.parseTakenEvent.bind(this.rundownEventParser))
        )
    }

    public subscribeToRundownSetNext(onSetNext: (event: PartSetAsNextEvent) => void): EventSubscription {
        return this.eventObserver.subscribe(
            RundownEventType.SET_NEXT,
            this.createEventValidatingConsumer(onSetNext, this.rundownEventParser.parseSetNextEvent.bind(this.rundownEventParser))
        )
    }

    public subscribeToRundownInfinitePieceAdded(onInfinitePieceAdded: (event: RundownInfinitePieceAddedEvent) => void): EventSubscription {
        return this.eventObserver.subscribe(
            RundownEventType.INFINITE_PIECE_ADDED,
            this.createEventValidatingConsumer(onInfinitePieceAdded, this.rundownEventParser.parseInfinitePieceAdded.bind(this.rundownEventParser))
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
