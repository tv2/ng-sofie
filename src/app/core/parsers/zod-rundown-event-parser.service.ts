import { Injectable } from '@angular/core'
import {
    RundownInfinitePieceAddedEvent,
    RundownActivatedEvent,
    RundownDeactivatedEvent,
    RundownResetEvent,
    PartSetAsNextEvent,
    PartTakenEvent,
    RundownDeletedEvent
} from '../models/rundown-event'
import * as zod from 'zod'
import { RundownEventType } from '../models/rundown-event-type'
import { EntityParser } from '../abstractions/entity-parser.service'

@Injectable()
export class ZodRundownEventParser {
    private readonly rundownActivatedEventParser = zod.object({
        type: zod.literal(RundownEventType.ACTIVATED),
        timestamp: zod.number(),
        rundownId: zod.string().nonempty(),
    })

    private readonly rundownDeactivatedEventParser = zod.object({
        type: zod.literal(RundownEventType.DEACTIVATED),
        timestamp: zod.number(),
        rundownId: zod.string().nonempty(),
    })

    private readonly rundownDeletedEventParser = zod.object({
        type: zod.literal(RundownEventType.DELETED),
        timestamp: zod.number(),
        rundownId: zod.string().nonempty(),
    })

    private readonly rundownResetEventParser = zod.object({
        type: zod.literal(RundownEventType.RESET),
        timestamp: zod.number(),
        rundownId: zod.string().nonempty(),
    })

    private readonly rundownTakenEventParser = zod.object({
        type: zod.literal(RundownEventType.TAKEN),
        timestamp: zod.number(),
        rundownId: zod.string().nonempty(),
        segmentId: zod.string().nonempty(),
        partId: zod.string().nonempty(),
    })

    private readonly rundownSetNextEventParser = zod.object({
        type: zod.literal(RundownEventType.SET_NEXT),
        timestamp: zod.number(),
        rundownId: zod.string().nonempty(),
        segmentId: zod.string().nonempty(),
        partId: zod.string().nonempty(),
    })

    private readonly rundownInfinitePieceAddedEventParser = zod.object({
        type: zod.literal(RundownEventType.INFINITE_PIECE_ADDED),
        timestamp: zod.number(),
        rundownId: zod.string().nonempty(),
        infinitePiece: zod.object({})
            .nonstrict()
            .transform((piece: unknown) => this.entityParser.parsePiece(piece)),
    })

    constructor(private readonly entityParser: EntityParser) {}

    public parseActivatedEvent(maybeEvent: unknown): RundownActivatedEvent {
        return this.rundownActivatedEventParser.parse(maybeEvent)
    }

    public parseDeactivatedEvent(maybeEvent: unknown): RundownDeactivatedEvent {
        return this.rundownDeactivatedEventParser.parse(maybeEvent)
    }

    public parseDeletedEvent(maybeEvent: unknown): RundownDeletedEvent {
        return this.rundownDeletedEventParser.parse(maybeEvent)
    }

    public parseResetEvent(maybeEvent: unknown): RundownResetEvent {
        return this.rundownResetEventParser.parse(maybeEvent)
    }

    public parseTakenEvent(maybeEvent: unknown): PartTakenEvent {
        return this.rundownTakenEventParser.parse(maybeEvent)
    }

    public parseSetNextEvent(maybeEvent: unknown): PartSetAsNextEvent {
        return this.rundownSetNextEventParser.parse(maybeEvent)
    }

    public parseInfinitePieceAdded(maybeEvent: unknown): RundownInfinitePieceAddedEvent {
        return this.rundownInfinitePieceAddedEventParser.parse(maybeEvent)
    }
}
