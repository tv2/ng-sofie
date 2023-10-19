import { Injectable } from '@angular/core'
import {
    PartCreatedEvent,
    PartDeletedEvent,
    PartSetAsNextEvent,
    PartTakenEvent,
    PartUpdatedEvent,
    RundownActivatedEvent, RundownCreatedEvent,
    RundownDeactivatedEvent,
    RundownDeletedEvent,
    RundownInfinitePieceAddedEvent,
    RundownResetEvent, RundownUpdatedEvent,
    SegmentCreatedEvent,
    SegmentDeletedEvent,
    SegmentUpdatedEvent
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
    infinitePiece: zod
      .object({})
      .nonstrict()
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

  public parseInfinitePieceAdded(maybeEvent: unknown): RundownInfinitePieceAddedEvent {
    return this.rundownInfinitePieceAddedEventParser.parse(maybeEvent)
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
