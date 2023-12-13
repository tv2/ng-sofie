import { Injectable } from '@angular/core'
import {
  RundownInfinitePiecesUpdatedEvent,
  RundownActivatedEvent,
  RundownDeactivatedEvent,
  RundownResetEvent,
  PartSetAsNextEvent,
  PartTakenEvent,
  RundownDeletedEvent,
  RundownPartInsertedAsOnAirEvent,
  RundownPartInsertedAsNextEvent,
  RundownPieceInsertedEvent,
  RundownCreatedEvent,
  RundownUpdatedEvent,
  SegmentUpdatedEvent,
  SegmentDeletedEvent,
  SegmentCreatedEvent,
  PartCreatedEvent,
  PartDeletedEvent,
  PartUpdatedEvent,
  SegmentUnsyncedEvent,
  PartUnsyncedEvent,
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

  private readonly rundownInfinitePiecesUpdatedEventParser = zod.object({
    type: zod.literal(RundownEventType.INFINITE_PIECES_UPDATED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    infinitePieces: zod
      .object({})
      .passthrough()
      .transform((piece: unknown) => this.entityParser.parsePiece(piece))
      .array(),
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
    rundownId: zod.string().min(1),
    basicRundown: zod
      .object({})
      .passthrough()
      .transform((basicRundown: unknown) => this.entityParser.parseBasicRundown(basicRundown)),
  })

  private readonly rundownUpdatedEventParser = zod.object({
    type: zod.literal(RundownEventType.RUNDOWN_UPDATED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    basicRundown: zod
      .object({})
      .passthrough()
      .transform((basicRundown: unknown) => this.entityParser.parseBasicRundown(basicRundown)),
  })

  private readonly rundownDeletedEventParser = zod.object({
    type: zod.literal(RundownEventType.RUNDOWN_DELETED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
  })

  private readonly segmentCreatedEventParser = zod.object({
    type: zod.literal(RundownEventType.SEGMENT_CREATED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    segment: zod
      .object({})
      .passthrough()
      .transform((segment: unknown) => this.entityParser.parseSegment(segment)),
  })

  private readonly segmentUpdatedEventParser = zod.object({
    type: zod.literal(RundownEventType.SEGMENT_UPDATED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    segment: zod
      .object({})
      .passthrough()
      .transform((segment: unknown) => this.entityParser.parseSegment(segment)),
  })

  private readonly segmentDeletedEventParser = zod.object({
    type: zod.literal(RundownEventType.SEGMENT_DELETED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    segmentId: zod.string().min(1),
  })

  private readonly segmentUnsyncedEventParser = zod.object({
    type: zod.literal(RundownEventType.SEGMENT_UNSYNCED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    unsyncedSegment: zod
      .object({})
      .passthrough()
      .transform((segment: unknown) => this.entityParser.parseSegment(segment)),
    originalSegmentId: zod.string().min(1),
  })

  private readonly partCreatedEventParser = zod.object({
    type: zod.literal(RundownEventType.PART_CREATED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    part: zod
      .object({})
      .passthrough()
      .transform((part: unknown) => this.entityParser.parsePart(part)),
  })

  private readonly partUpdatedEventParser = zod.object({
    type: zod.literal(RundownEventType.PART_UPDATED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    part: zod
      .object({})
      .passthrough()
      .transform((part: unknown) => this.entityParser.parsePart(part)),
  })

  private readonly partDeletedEventParser = zod.object({
    type: zod.literal(RundownEventType.PART_DELETED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    segmentId: zod.string().min(1),
    partId: zod.string().min(1),
  })

  private readonly partUnsyncedEventParser = zod.object({
    type: zod.literal(RundownEventType.PART_UNSYNCED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    part: zod
      .object({})
      .passthrough()
      .transform((part: unknown) => this.entityParser.parsePart(part)),
  })

  constructor(private readonly entityParser: EntityParser) {}

  public parseRundownActivatedEvent(event: unknown): RundownActivatedEvent {
    return this.rundownActivatedEventParser.parse(event)
  }
  public parseRundownDeactivatedEvent(event: unknown): RundownDeactivatedEvent {
    return this.rundownDeactivatedEventParser.parse(event)
  }

  public parseRundownResetEvent(event: unknown): RundownResetEvent {
    return this.rundownResetEventParser.parse(event)
  }

  public parseTakenEvent(event: unknown): PartTakenEvent {
    return this.rundownTakenEventParser.parse(event)
  }

  public parseSetNextEvent(event: unknown): PartSetAsNextEvent {
    return this.rundownSetNextEventParser.parse(event)
  }

  public parseInfinitePiecesUpdatedEvent(event: unknown): RundownInfinitePiecesUpdatedEvent {
    return this.rundownInfinitePiecesUpdatedEventParser.parse(event)
  }

  public parsePartInsertedAsOnAirEvent(event: unknown): RundownPartInsertedAsOnAirEvent {
    return this.rundownPartInsertedAsOnAirEventParser.parse(event)
  }

  public parsePartInsertedAsNextEvent(event: unknown): RundownPartInsertedAsNextEvent {
    return this.rundownPartInsertedAsNextEventParser.parse(event)
  }

  public parsePieceInsertedEvent(event: unknown): RundownPieceInsertedEvent {
    return this.rundownPieceInsertedEventParser.parse(event)
  }

  public parseRundownCreatedEvent(event: unknown): RundownCreatedEvent {
    return this.rundownCreatedEventParser.parse(event)
  }

  public parseRundownUpdatedEvent(event: unknown): RundownUpdatedEvent {
    return this.rundownUpdatedEventParser.parse(event)
  }

  public parseRundownDeletedEvent(event: unknown): RundownDeletedEvent {
    return this.rundownDeletedEventParser.parse(event)
  }

  public parseSegmentCreatedEvent(event: unknown): SegmentCreatedEvent {
    return this.segmentCreatedEventParser.parse(event)
  }

  public parseSegmentUpdatedEvent(event: unknown): SegmentUpdatedEvent {
    return this.segmentUpdatedEventParser.parse(event)
  }

  public parseSegmentDeletedEvent(event: unknown): SegmentDeletedEvent {
    return this.segmentDeletedEventParser.parse(event)
  }

  public parseSegmentUnsyncedEvent(event: unknown): SegmentUnsyncedEvent {
    return this.segmentUnsyncedEventParser.parse(event)
  }

  public parsePartCreatedEvent(event: unknown): PartCreatedEvent {
    return this.partCreatedEventParser.parse(event)
  }

  public parsePartUpdatedEvent(event: unknown): PartUpdatedEvent {
    return this.partUpdatedEventParser.parse(event)
  }

  public parsePartDeletedEvent(event: unknown): PartDeletedEvent {
    return this.partDeletedEventParser.parse(event)
  }

  public parsePartUnsyncedEvent(event: unknown): PartUnsyncedEvent {
    return this.partUnsyncedEventParser.parse(event)
  }
}
