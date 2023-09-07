import { Injectable } from '@angular/core'
import {
    RundownInfinitePieceAddedEvent,
    RundownActivatedEvent,
    RundownDeactivatedEvent,
    RundownResetEvent,
    PartSetAsNextEvent,
    PartTakenEvent, RundownAdLibPieceInsertedEvent, RundownDeletedEvent
} from '../../models/rundown-event'

@Injectable()
export abstract class RundownEventParser {
    public abstract parseActivatedEvent(maybeEvent: unknown): RundownActivatedEvent

    public abstract parseDeactivatedEvent(maybeEvent: unknown): RundownDeactivatedEvent

    public abstract parseDeletedEvent(maybeEvent: unknown): RundownDeletedEvent

    public abstract parseResetEvent(maybeEvent: unknown): RundownResetEvent

    public abstract parseTakenEvent(maybeEvent: unknown): PartTakenEvent

    public abstract parseSetNextEvent(maybeEvent: unknown): PartSetAsNextEvent

    public abstract parseAdLibPieceInserted(maybeEvent: unknown): RundownAdLibPieceInsertedEvent

    public abstract parseInfinitePieceAdded(maybeEvent: unknown): RundownInfinitePieceAddedEvent
}
