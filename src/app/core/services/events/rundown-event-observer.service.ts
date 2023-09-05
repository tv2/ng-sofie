import { EventConsumer, EventObserver, TypedEvent, Unsubscribe } from './event-observer.service'
import { Injectable } from '@angular/core'
import { RundownEventParser } from './rundown-event-parser.service'
import { RundownEventType } from '../../models/rundown-event-type'
import {
    RundownActivatedEvent, RundownAdLibPieceInserted,
    RundownDeactivatedEvent, RundownInfinitePieceAddedEvent,
    RundownResetEvent, RundownSetNextEvent,
    RundownTakenEvent
} from '../../models/rundown-event'

@Injectable()
export class RundownEventObserver {
    constructor(private readonly eventObserver: EventObserver, private readonly rundownEventParser: RundownEventParser) {}

    public subscribeToRundownActivation(consumer: (event: RundownActivatedEvent) => void): Unsubscribe {
        return this.eventObserver.subscribe(
            RundownEventType.ACTIVATED,
            this.createEventValidatingConsumer(consumer, this.rundownEventParser.parseActivatedEvent)
        )
    }

    public subscribeToRundownDeactivation(consumer: (event: RundownDeactivatedEvent) => void): Unsubscribe {
        return this.eventObserver.subscribe(
            RundownEventType.DEACTIVATED,
            this.createEventValidatingConsumer(consumer, this.rundownEventParser.parseDeactivatedEvent)
        )
    }

    public subscribeToRundownReset(consumer: (event: RundownResetEvent) => void): Unsubscribe {
        return this.eventObserver.subscribe(
            RundownEventType.RESET,
            this.createEventValidatingConsumer(consumer, this.rundownEventParser.parseResetEvent)
        )
    }

    public subscribeToRundownTake(consumer: (event: RundownTakenEvent) => void): Unsubscribe {
        return this.eventObserver.subscribe(
            RundownEventType.TAKEN,
            this.createEventValidatingConsumer(consumer, this.rundownEventParser.parseTakenEvent)
        )
    }

    public subscribeToRundownSetNext(consumer: (event: RundownSetNextEvent) => void): Unsubscribe {
        return this.eventObserver.subscribe(
            RundownEventType.SET_NEXT,
            this.createEventValidatingConsumer(consumer, this.rundownEventParser.parseSetNextEvent)
        )
    }

    public subscribeToRundownAdLibPieceInserted(consumer: (event: RundownAdLibPieceInserted) => void): Unsubscribe {
        return this.eventObserver.subscribe(
            RundownEventType.AD_LIB_PIECE_INSERTED,
            this.createEventValidatingConsumer(consumer, this.rundownEventParser.parseAdLibPieceInserted)
        )
    }

    public subscribeToRundownInfinitePieceAdded(consumer: (event: RundownInfinitePieceAddedEvent) => void): Unsubscribe {
        return this.eventObserver.subscribe(
            RundownEventType.INFINITE_PIECE_ADDED,
            this.createEventValidatingConsumer(consumer, this.rundownEventParser.parseInfinitePieceAdded)
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
