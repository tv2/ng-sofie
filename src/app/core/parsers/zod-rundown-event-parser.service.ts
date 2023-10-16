import { Injectable } from '@angular/core'
import {
  RundownInfinitePieceAddedEvent,
  RundownActivatedEvent,
  RundownDeactivatedEvent,
  RundownResetEvent,
  PartSetAsNextEvent,
  PartTakenEvent,
  RundownDeletedEvent,
  RundownPartInsertedAsOnAirEvent,
  RundownPartInsertedAsNextEvent,
  RundownPieceInsertedEvent,
} from '../models/rundown-event'
import * as zod from 'zod'
import { RundownEventType } from '../models/rundown-event-type'
import { EntityParser } from '../abstractions/entity-parser.service'
import { RundownEventParser } from '../abstractions/rundown-event.parser'

@Injectable()
export class ZodRundownEventParser implements RundownEventParser {
  private readonly rundownActivatedEventParser = zod.object({
    type: zod.literal(RundownEventType.ACTIVATED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
  })

  private readonly rundownDeactivatedEventParser = zod.object({
    type: zod.literal(RundownEventType.DEACTIVATED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
  })

  private readonly rundownDeletedEventParser = zod.object({
    type: zod.literal(RundownEventType.DELETED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
  })

  private readonly rundownResetEventParser = zod.object({
    type: zod.literal(RundownEventType.RESET),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
  })

  private readonly rundownTakenEventParser = zod.object({
    type: zod.literal(RundownEventType.TAKEN),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    segmentId: zod.string().min(1),
    partId: zod.string().min(1),
  })

  private readonly rundownSetNextEventParser = zod.object({
    type: zod.literal(RundownEventType.SET_NEXT),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    segmentId: zod.string().min(1),
    partId: zod.string().min(1),
  })

  private readonly rundownInfinitePieceAddedEventParser = zod.object({
    type: zod.literal(RundownEventType.INFINITE_PIECE_ADDED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    infinitePiece: zod
      .object({})
      .passthrough()
      .transform((piece: unknown) => this.entityParser.parsePiece(piece)),
  })

  private readonly rundownPartInsertedAsOnAirEventParser = zod.object({
    type: zod.literal(RundownEventType.PART_INSERTED_AS_ON_AIR),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    part: zod
      .object({})
      .passthrough()
      .transform((part: unknown) => this.entityParser.parsePart(part)),
  })

  private readonly rundownPartInsertedAsNextEventParser = zod.object({
    type: zod.literal(RundownEventType.PART_INSERTED_AS_NEXT),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    part: zod
      .object({})
      .passthrough()
      .transform((part: unknown) => this.entityParser.parsePart(part)),
  })

  private readonly rundownPieceInsertedEventParser = zod.object({
    type: zod.literal(RundownEventType.PIECE_INSERTED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    segmentId: zod.string().min(1),
    partId: zod.string().min(1),
    piece: zod
      .object({})
      .passthrough()
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

  public parseInfinitePieceAddedEvent(maybeEvent: unknown): RundownInfinitePieceAddedEvent {
    return this.rundownInfinitePieceAddedEventParser.parse(maybeEvent)
  }

  public parsePartInsertedAsOnAirEvent(maybeEvent: unknown): RundownPartInsertedAsOnAirEvent {
    return this.rundownPartInsertedAsOnAirEventParser.parse(maybeEvent)
  }

  public parsePartInsertedAsNextEvent(maybeEvent: unknown): RundownPartInsertedAsNextEvent {
    return this.rundownPartInsertedAsNextEventParser.parse(maybeEvent)
  }

  public parsePieceInsertedEvent(maybeEvent: unknown): RundownPieceInsertedEvent {
    return this.rundownPieceInsertedEventParser.parse(maybeEvent)
  }
}
