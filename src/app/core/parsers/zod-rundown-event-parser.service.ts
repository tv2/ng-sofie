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
    SegmentDeletedEvent,
    PartCreatedEvent,
    PartUpdatedEvent,
    PartDeletedEvent,
    SegmentUpdatedEvent, SegmentCreatedEvent, RundownUpdatedEvent, RundownCreatedEvent,
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

  private readonly rundownCreatedEventParser = zod.object({
      type: zod.literal(RundownEventType.RUNDOWN_CREATED),
      timestamp: zod.number(),
      rundownId: zod.string().nonempty(),
  })

  private readonly rundownUpdatedEventParser = zod.object({
    type: zod.literal(RundownEventType.RUNDOWN_UPDATED),
    timestamp: zod.number(),
    rundownId: zod.string().nonempty(),
  })

  private readonly rundownDeletedEventParser = zod.object({
    type: zod.literal(RundownEventType.RUNDOWN_DELETED),
    timestamp: zod.number(),
    rundownId: zod.string().nonempty(),
  })

  private readonly segmentCreatedEventParser = zod.object({
        type: zod.literal(RundownEventType.SEGMENT_CREATED),
        timestamp: zod.number(),
        rundownId: zod.string()
    })

    private readonly segmentUpdatedEventParser = zod.object({
        type: zod.literal(RundownEventType.SEGMENT_UPDATED),
        timestamp: zod.number(),
        rundownId: zod.string()
    })

    private readonly segmentDeletedEventParser = zod.object({
        type: zod.literal(RundownEventType.SEGMENT_DELETED),
        timestamp: zod.number(),
        rundownId: zod.string()
    })

    private readonly partCreatedEventParser = zod.object({
        type: zod.literal(RundownEventType.PART_CREATED),
        timestamp: zod.number(),
        rundownId: zod.string().nonempty(),
    })

    private readonly partUpdatedEventParser = zod.object({
        type: zod.literal(RundownEventType.PART_UPDATED),
        timestamp: zod.number(),
        rundownId: zod.string().nonempty(),
    })

    private readonly partDeletedEventParser = zod.object({
        type: zod.literal(RundownEventType.PART_DELETED),
        timestamp: zod.number(),
        rundownId: zod.string().nonempty(),
        partId: zod.string().nonempty()
    })

    constructor(private readonly entityParser: EntityParser) {}

  public parseActivatedEvent(maybeEvent: unknown): RundownActivatedEvent {
    return this.rundownActivatedEventParser.parse(maybeEvent)
  }
  public parseDeactivatedEvent(maybeEvent: unknown): RundownDeactivatedEvent {
    return this.rundownDeactivatedEventParser.parse(maybeEvent)
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

  public parseRundownCreatedEvent(maybeEvent: unknown): RundownCreatedEvent {
      return this.rundownCreatedEventParser.parse(maybeEvent)
  }

  public parseRundownUpdatedEvent(maybeEvent: unknown): RundownUpdatedEvent {
      return this.rundownUpdatedEventParser.parse(maybeEvent)
  }

    public parseRundownDeletedEvent(maybeEvent: unknown): RundownDeletedEvent {
        return this.rundownDeletedEventParser.parse(maybeEvent)
    }

    public parseSegmentCreatedEvent(maybeEvent: unknown): SegmentCreatedEvent {
        return this.segmentCreatedEventParser.parse(maybeEvent)
    }

    public parseSegmentUpdatedEvent(maybeEvent: unknown): SegmentUpdatedEvent {
        return this.segmentUpdatedEventParser.parse(maybeEvent)
    }

    public parseSegmentDeletedEvent(maybeEvent: unknown): SegmentDeletedEvent {
        return this.segmentDeletedEventParser.parse(maybeEvent)
    }

    public parsePartCreatedEvent(maybeEvent: unknown): PartCreatedEvent {
        return this.partCreatedEventParser.parse(maybeEvent)
    }

    public parsePartUpdatedEvent(maybeEvent: unknown): PartUpdatedEvent {
        return this.partUpdatedEventParser.parse(maybeEvent)
    }

    public parsePartDeletedEvent(maybeEvent: unknown): PartDeletedEvent {
        return this.partDeletedEventParser.parse(maybeEvent)
    }
}
