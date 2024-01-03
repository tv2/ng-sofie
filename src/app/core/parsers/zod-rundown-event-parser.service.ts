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
import { EntityValidator } from '../abstractions/entity-validator.service'
import { RundownEventValidator } from '../abstractions/rundown-event-validator.service'

@Injectable()
export class ZodRundownEventParser implements RundownEventValidator {
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
      .transform((piece: unknown) => this.entityParser.validatePiece(piece))
      .array(),
  })

  private readonly rundownPartInsertedAsOnAirEventParser = zod.object({
    type: zod.literal(RundownEventType.PART_INSERTED_AS_ON_AIR),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    part: zod
      .object({})
      .passthrough()
      .transform((part: unknown) => this.entityParser.validatePart(part)),
  })

  private readonly rundownPartInsertedAsNextEventParser = zod.object({
    type: zod.literal(RundownEventType.PART_INSERTED_AS_NEXT),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    part: zod
      .object({})
      .passthrough()
      .transform((part: unknown) => this.entityParser.validatePart(part)),
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
      .transform((piece: unknown) => this.entityParser.validatePiece(piece)),
  })

  private readonly rundownCreatedEventParser = zod.object({
    type: zod.literal(RundownEventType.RUNDOWN_CREATED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    rundown: zod
      .object({})
      .passthrough()
      .transform((rundown: unknown) => this.entityParser.validateRundown(rundown)),
  })

  private readonly rundownUpdatedEventParser = zod.object({
    type: zod.literal(RundownEventType.RUNDOWN_UPDATED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    basicRundown: zod
      .object({})
      .passthrough()
      .transform((basicRundown: unknown) => this.entityParser.validateBasicRundown(basicRundown)),
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
      .transform((segment: unknown) => this.entityParser.validateSegment(segment)),
  })

  private readonly segmentUpdatedEventParser = zod.object({
    type: zod.literal(RundownEventType.SEGMENT_UPDATED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    segment: zod
      .object({})
      .passthrough()
      .transform((segment: unknown) => this.entityParser.validateSegment(segment)),
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
      .transform((segment: unknown) => this.entityParser.validateSegment(segment)),
    originalSegmentId: zod.string().min(1),
  })

  private readonly partCreatedEventParser = zod.object({
    type: zod.literal(RundownEventType.PART_CREATED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    part: zod
      .object({})
      .passthrough()
      .transform((part: unknown) => this.entityParser.validatePart(part)),
  })

  private readonly partUpdatedEventParser = zod.object({
    type: zod.literal(RundownEventType.PART_UPDATED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    part: zod
      .object({})
      .passthrough()
      .transform((part: unknown) => this.entityParser.validatePart(part)),
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
      .transform((part: unknown) => this.entityParser.validatePart(part)),
  })

  constructor(private readonly entityParser: EntityValidator) {}

  public validateRundownActivatedEvent(event: unknown): RundownActivatedEvent {
    return this.rundownActivatedEventParser.parse(event)
  }
  public validateRundownDeactivatedEvent(event: unknown): RundownDeactivatedEvent {
    return this.rundownDeactivatedEventParser.parse(event)
  }

  public validateRundownResetEvent(event: unknown): RundownResetEvent {
    return this.rundownResetEventParser.parse(event)
  }

  public validateTakenEvent(event: unknown): PartTakenEvent {
    return this.rundownTakenEventParser.parse(event)
  }

  public validateSetNextEvent(event: unknown): PartSetAsNextEvent {
    return this.rundownSetNextEventParser.parse(event)
  }

  public validateInfinitePiecesUpdatedEvent(event: unknown): RundownInfinitePiecesUpdatedEvent {
    return this.rundownInfinitePiecesUpdatedEventParser.parse(event)
  }

  public validatePartInsertedAsOnAirEvent(event: unknown): RundownPartInsertedAsOnAirEvent {
    return this.rundownPartInsertedAsOnAirEventParser.parse(event)
  }

  public validatePartInsertedAsNextEvent(event: unknown): RundownPartInsertedAsNextEvent {
    return this.rundownPartInsertedAsNextEventParser.parse(event)
  }

  public validatePieceInsertedEvent(event: unknown): RundownPieceInsertedEvent {
    return this.rundownPieceInsertedEventParser.parse(event)
  }

  public validateRundownCreatedEvent(event: unknown): RundownCreatedEvent {
    return this.rundownCreatedEventParser.parse(event)
  }

  public validateRundownUpdatedEvent(event: unknown): RundownUpdatedEvent {
    return this.rundownUpdatedEventParser.parse(event)
  }

  public validateRundownDeletedEvent(event: unknown): RundownDeletedEvent {
    return this.rundownDeletedEventParser.parse(event)
  }

  public validateSegmentCreatedEvent(event: unknown): SegmentCreatedEvent {
    return this.segmentCreatedEventParser.parse(event)
  }

  public validateSegmentUpdatedEvent(event: unknown): SegmentUpdatedEvent {
    return this.segmentUpdatedEventParser.parse(event)
  }

  public validateSegmentDeletedEvent(event: unknown): SegmentDeletedEvent {
    return this.segmentDeletedEventParser.parse(event)
  }

  public validateSegmentUnsyncedEvent(event: unknown): SegmentUnsyncedEvent {
    return this.segmentUnsyncedEventParser.parse(event)
  }

  public validatePartCreatedEvent(event: unknown): PartCreatedEvent {
    return this.partCreatedEventParser.parse(event)
  }

  public validatePartUpdatedEvent(event: unknown): PartUpdatedEvent {
    return this.partUpdatedEventParser.parse(event)
  }

  public validatePartDeletedEvent(event: unknown): PartDeletedEvent {
    return this.partDeletedEventParser.parse(event)
  }

  public validatePartUnsyncedEvent(event: unknown): PartUnsyncedEvent {
    return this.partUnsyncedEventParser.parse(event)
  }
}
