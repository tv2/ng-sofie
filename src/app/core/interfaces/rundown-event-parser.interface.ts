import { Injectable } from '@angular/core'
import {
    RundownInfinitePieceAddedEvent,
    RundownActivatedEvent,
    RundownDeactivatedEvent,
    RundownResetEvent,
    RundownSetNextEvent,
    RundownTakenEvent, RundownAdLibPieceInserted, RundownDeletedEvent
} from '../models/rundown-event'

@Injectable()
export abstract class RundownEventParser {
    public abstract parseActivatedEvent(maybeEvent: unknown): RundownActivatedEvent

    public abstract parseDeactivatedEvent(maybeEvent: unknown): RundownDeactivatedEvent

    public abstract parseDeletedEvent(maybeEvent: unknown): RundownDeletedEvent

    public abstract parseResetEvent(maybeEvent: unknown): RundownResetEvent

    public abstract parseTakenEvent(maybeEvent: unknown): RundownTakenEvent

    public abstract parseSetNextEvent(maybeEvent: unknown): RundownSetNextEvent

    public abstract parseAdLibPieceInserted(maybeEvent: unknown): RundownAdLibPieceInserted

    public abstract parseInfinitePieceAdded(maybeEvent: unknown): RundownInfinitePieceAddedEvent
}
