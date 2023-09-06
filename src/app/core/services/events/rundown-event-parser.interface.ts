import { RUNDOWN_ACTIVATED_EVENT_PARSER } from '../../parsers/events/rundown-activated-event.schema'
import { Injectable } from '@angular/core'
import { RUNDOWN_TAKEN_EVENT_PARSER } from '../../parsers/events/rundown-taken-event.schema'
import {
    RundownInfinitePieceAddedEvent,
    RundownActivatedEvent,
    RundownDeactivatedEvent,
    RundownResetEvent,
    RundownSetNextEvent,
    RundownTakenEvent, RundownAdLibPieceInserted, RundownDeletedEvent
} from '../../models/rundown-event'
import { RUNDOWN_DEACTIVATED_EVENT_PARSER } from '../../parsers/events/rundown-deactivated-event.schema'
import { RUNDOWN_RESET_EVENT_PARSER } from '../../parsers/events/rundown-reset-event.schema'
import { RUNDOWN_SET_NEXT_EVENT_PARSER } from '../../parsers/events/rundown-set-next-event.schema'
import { RUNDOWN_AD_LIB_PIECE_INSERTED_EVENT_PARSER } from '../../parsers/events/rundown-adlib-piece-inserted-event.schema'
import { RUNDOWN_INFINITE_PIECE_ADDED_EVENT_PARSER } from '../../parsers/events/r-u-n-d-o-w-n_-i-n-f-i-n-i-t-e_-p-i-e-c-e_-a-d-d-e-d_-e-v-e-n-t_-p-a-r-s-e.r'
import { RUNDOWN_DELETED_EVENT_PARSER } from '../../parsers/events/rundown-deleted-event.schema'

@Injectable()
export class RundownEventParser {
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

    public parseTakenEvent(maybeEvent: unknown): RundownTakenEvent {
        return RUNDOWN_TAKEN_EVENT_PARSER.parse(maybeEvent)
    }

    public parseSetNextEvent(maybeEvent: unknown): RundownSetNextEvent {
        return RUNDOWN_SET_NEXT_EVENT_PARSER.parse(maybeEvent)
    }

    public parseAdLibPieceInserted(maybeEvent: unknown): RundownAdLibPieceInserted {
        return RUNDOWN_AD_LIB_PIECE_INSERTED_EVENT_PARSER.parse(maybeEvent)
    }

    public parseInfinitePieceAdded(maybeEvent: unknown): RundownInfinitePieceAddedEvent {
        return RUNDOWN_INFINITE_PIECE_ADDED_EVENT_PARSER.parse(maybeEvent)
    }
}
