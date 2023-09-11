import { Injectable } from '@angular/core'
import {
    RundownInfinitePieceAddedEvent,
    RundownActivatedEvent,
    RundownDeactivatedEvent,
    RundownResetEvent,
    PartSetAsNextEvent,
    PartTakenEvent, RundownAdLibPieceInsertedEvent, RundownDeletedEvent
} from '../models/rundown-event'
import * as zod from 'zod'
import { RundownEventType } from '../models/rundown-event-type'
import { EntityParser } from '../abstractions/entity.parser'

@Injectable()
export class ZodRundownEventParser {

    constructor(private readonly entityParser: EntityParser) {}

    private RUNDOWN_ACTIVATED_EVENT_PARSER = zod.object({
        type: zod.literal(RundownEventType.ACTIVATED),
        rundownId: zod.string().nonempty(),
        segmentId: zod.string().nonempty(),
        partId: zod.string().nonempty(),
    })
    public parseActivatedEvent(maybeEvent: unknown): RundownActivatedEvent {
        return this.RUNDOWN_ACTIVATED_EVENT_PARSER.parse(maybeEvent)
    }

    private RUNDOWN_DEACTIVATED_EVENT_PARSER = zod.object({
        type: zod.literal(RundownEventType.DEACTIVATED),
        rundownId: zod.string().nonempty(),
    })
    public parseDeactivatedEvent(maybeEvent: unknown): RundownDeactivatedEvent {
        return this.RUNDOWN_DEACTIVATED_EVENT_PARSER.parse(maybeEvent)
    }

    private RUNDOWN_DELETED_EVENT_PARSER = zod.object({
        type: zod.literal(RundownEventType.DELETED),
        rundownId: zod.string().nonempty(),
    })
    public parseDeletedEvent(maybeEvent: unknown): RundownDeletedEvent {
        return this.RUNDOWN_DELETED_EVENT_PARSER.parse(maybeEvent)
    }

    private RUNDOWN_RESET_EVENT_PARSER = zod.object({
        type: zod.literal(RundownEventType.RESET),
        rundownId: zod.string().nonempty(),
    })
    public parseResetEvent(maybeEvent: unknown): RundownResetEvent {
        return this.RUNDOWN_RESET_EVENT_PARSER.parse(maybeEvent)
    }

    private RUNDOWN_TAKEN_EVENT_PARSER = zod.object({
        type: zod.literal(RundownEventType.TAKEN),
        rundownId: zod.string().nonempty(),
        segmentId: zod.string().nonempty(),
        partId: zod.string().nonempty(),
    })
    public parseTakenEvent(maybeEvent: unknown): PartTakenEvent {
        return this.RUNDOWN_TAKEN_EVENT_PARSER.parse(maybeEvent)
    }

    private RUNDOWN_SET_NEXT_EVENT_PARSER = zod.object({
        type: zod.literal(RundownEventType.SET_NEXT),
        rundownId: zod.string().nonempty(),
        segmentId: zod.string().nonempty(),
        partId: zod.string().nonempty(),
    })
    public parseSetNextEvent(maybeEvent: unknown): PartSetAsNextEvent {
        return this.RUNDOWN_SET_NEXT_EVENT_PARSER.parse(maybeEvent)
    }

    private RUNDOWN_AD_LIB_PIECE_INSERTED_EVENT_PARSER = zod.object({
        type: zod.literal(RundownEventType.AD_LIB_PIECE_INSERTED),
        rundownId: zod.string().nonempty(),
        segmentId: zod.string().nonempty(),
        partId: zod.string().nonempty(),
        adLibPiece: zod.object({})
            .transform(adLibPiece => this.entityParser.parseAdLibPiece(adLibPiece)),
    })
    public parseAdLibPieceInserted(maybeEvent: unknown): RundownAdLibPieceInsertedEvent {
        return this.RUNDOWN_AD_LIB_PIECE_INSERTED_EVENT_PARSER.parse(maybeEvent)
    }

    private RUNDOWN_INFINITE_PIECE_ADDED_EVENT_PARSER = zod.object({
        type: zod.literal(RundownEventType.INFINITE_PIECE_ADDED),
        rundownId: zod.string().nonempty(),
        infinitePiece: zod.object({})
            .transform(piece => this.entityParser.parsePiece(piece)),
    })
    public parseInfinitePieceAdded(maybeEvent: unknown): RundownInfinitePieceAddedEvent {
        return this.RUNDOWN_INFINITE_PIECE_ADDED_EVENT_PARSER.parse(maybeEvent)
    }
}
