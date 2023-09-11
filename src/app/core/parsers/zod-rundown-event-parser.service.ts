import { RUNDOWN_ACTIVATED_EVENT_PARSER } from './events/rundown-activated-event.schema'
import { Injectable } from '@angular/core'
import { RUNDOWN_TAKEN_EVENT_PARSER } from './events/rundown-taken-event.schema'
import {
    RundownInfinitePieceAddedEvent,
    RundownActivatedEvent,
    RundownDeactivatedEvent,
    RundownResetEvent,
    PartSetAsNextEvent,
    PartTakenEvent, RundownAdLibPieceInsertedEvent, RundownDeletedEvent
} from '../models/rundown-event'
import { RUNDOWN_DEACTIVATED_EVENT_PARSER } from './events/rundown-deactivated-event.schema'
import { RUNDOWN_RESET_EVENT_PARSER } from './events/rundown-reset-event.schema'
import { RUNDOWN_SET_NEXT_EVENT_PARSER } from './events/rundown-set-next-event.schema'
import { RUNDOWN_AD_LIB_PIECE_INSERTED_EVENT_PARSER } from './events/rundown-adlib-piece-inserted-event.schema'
import { RUNDOWN_INFINITE_PIECE_ADDED_EVENT_PARSER } from './events/rundown-infinite-piece-added-event.schema'
import { RUNDOWN_DELETED_EVENT_PARSER } from './events/rundown-deleted-event.schema'

@Injectable()
export class ZodRundownEventParser {
    public parseActivatedEvent(maybeEvent: unknown): RundownActivatedEvent {
        return RUNDOWN_ACTIVATED_EVENT_PARSER.parse(maybeEvent)
    }

    public parseDeactivatedEvent(maybeEvent: unknown): RundownDeactivatedEvent {
        return RUNDOWN_DEACTIVATED_EVENT_PARSER.parse(maybeEvent)
    }

    public parseDeletedEvent(maybeEvent: unknown): RundownDeletedEvent {
        return RUNDOWN_DELETED_EVENT_PARSER.parse(maybeEvent)
    }

    public parseResetEvent(maybeEvent: unknown): RundownResetEvent {
        return RUNDOWN_RESET_EVENT_PARSER.parse(maybeEvent)
    }

    public parseTakenEvent(maybeEvent: unknown): PartTakenEvent {
        return RUNDOWN_TAKEN_EVENT_PARSER.parse(maybeEvent)
    }

    public parseSetNextEvent(maybeEvent: unknown): PartSetAsNextEvent {
        return RUNDOWN_SET_NEXT_EVENT_PARSER.parse(maybeEvent)
    }

    public parseAdLibPieceInserted(maybeEvent: unknown): RundownAdLibPieceInsertedEvent {
        return RUNDOWN_AD_LIB_PIECE_INSERTED_EVENT_PARSER.parse(maybeEvent)
    }

    public parseInfinitePieceAdded(maybeEvent: unknown): RundownInfinitePieceAddedEvent {
        return RUNDOWN_INFINITE_PIECE_ADDED_EVENT_PARSER.parse(maybeEvent)
    }
}
