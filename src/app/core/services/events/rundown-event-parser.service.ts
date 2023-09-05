import { rundownActivatedEventSchema } from '../../schemas/rundown-activated-event.schema'
import { Injectable } from '@angular/core'
import { rundownTakenEventSchema } from '../../schemas/rundown-taken-event.schema'
import {
    RundownInfinitePieceAddedEvent,
    RundownActivatedEvent,
    RundownDeactivatedEvent,
    RundownResetEvent,
    RundownSetNextEvent,
    RundownTakenEvent, RundownAdLibPieceInserted
} from '../../models/rundown-event'
import { rundownDeactivatedEventSchema } from '../../schemas/rundown-deactivated-event.schema'
import { rundownResetEventSchema } from '../../schemas/rundown-reset-event.schema'
import { rundownSetNextEventSchema } from '../../schemas/rundown-set-next-event.schema'
import { rundownAdLibPieceInsertedEventSchema } from '../../schemas/rundown-adlib-piece-inserted-event.schema'
import { rundownInfinitePieceAddedEventSchema } from '../../schemas/rundown-infinite-piece-added-event.schema'

@Injectable()
export class RundownEventParser {
    public parseActivatedEvent(maybeEvent: unknown): RundownActivatedEvent {
        return rundownActivatedEventSchema.parse(maybeEvent)
    }

    public parseDeactivatedEvent(maybeEvent: unknown): RundownDeactivatedEvent {
        return rundownDeactivatedEventSchema.parse(maybeEvent)
    }

    public parseResetEvent(maybeEvent: unknown): RundownResetEvent {
        return rundownResetEventSchema.parse(maybeEvent)
    }

    public parseTakenEvent(maybeEvent: unknown): RundownTakenEvent {
        return rundownTakenEventSchema.parse(maybeEvent)
    }

    public parseSetNextEvent(maybeEvent: unknown): RundownSetNextEvent {
        return rundownSetNextEventSchema.parse(maybeEvent)
    }

    public parseAdLibPieceInserted(maybeEvent: unknown): RundownAdLibPieceInserted {
        return rundownAdLibPieceInsertedEventSchema.parse(maybeEvent)
    }

    public parseInfinitePieceAdded(maybeEvent: unknown): RundownInfinitePieceAddedEvent {
        return rundownInfinitePieceAddedEventSchema.parse(maybeEvent)
    }
}
