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
export class ZodRundownEventValidator implements RundownEventValidator {
  private readonly rundownActivatedEventValidator = zod.object({
    type: zod.literal(RundownEventType.ACTIVATED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
  })

  private readonly rundownDeactivatedEventValidator = zod.object({
    type: zod.literal(RundownEventType.DEACTIVATED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
  })

  private readonly rundownResetEventValidator = zod.object({
    type: zod.literal(RundownEventType.RESET),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
  })

  private readonly rundownTakenEventValidator = zod.object({
    type: zod.literal(RundownEventType.TAKEN),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    segmentId: zod.string().min(1),
    partId: zod.string().min(1),
  })

  private readonly rundownSetNextEventValidator = zod.object({
    type: zod.literal(RundownEventType.SET_NEXT),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    segmentId: zod.string().min(1),
    partId: zod.string().min(1),
  })

  private readonly rundownInfinitePiecesUpdatedEventValidator = zod.object({
    type: zod.literal(RundownEventType.INFINITE_PIECES_UPDATED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    infinitePieces: zod
      .object({})
      .passthrough()
      .transform((piece: unknown) => this.entityValidator.validatePiece(piece))
      .array(),
  })

  private readonly rundownPartInsertedAsOnAirEventValidator = zod.object({
    type: zod.literal(RundownEventType.PART_INSERTED_AS_ON_AIR),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    part: zod
      .object({})
      .passthrough()
      .transform((part: unknown) => this.entityValidator.validatePart(part)),
  })

  private readonly rundownPartInsertedAsNextEventValidator = zod.object({
    type: zod.literal(RundownEventType.PART_INSERTED_AS_NEXT),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    part: zod
      .object({})
      .passthrough()
      .transform((part: unknown) => this.entityValidator.validatePart(part)),
  })

  private readonly rundownPieceInsertedEventValidator = zod.object({
    type: zod.literal(RundownEventType.PIECE_INSERTED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    segmentId: zod.string().min(1),
    partId: zod.string().min(1),
    piece: zod
      .object({})
      .passthrough()
      .transform((piece: unknown) => this.entityValidator.validatePiece(piece)),
  })

  private readonly rundownCreatedEventValidator = zod.object({
    type: zod.literal(RundownEventType.RUNDOWN_CREATED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    rundown: zod
      .object({})
      .passthrough()
      .transform((rundown: unknown) => this.entityValidator.validateRundown(rundown)),
  })

  private readonly rundownUpdatedEventValidator = zod.object({
    type: zod.literal(RundownEventType.RUNDOWN_UPDATED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    basicRundown: zod
      .object({})
      .passthrough()
      .transform((basicRundown: unknown) => this.entityValidator.validateBasicRundown(basicRundown)),
  })

  private readonly rundownDeletedEventValidator = zod.object({
    type: zod.literal(RundownEventType.RUNDOWN_DELETED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
  })

  private readonly segmentCreatedEventValidator = zod.object({
    type: zod.literal(RundownEventType.SEGMENT_CREATED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    segment: zod
      .object({})
      .passthrough()
      .transform((segment: unknown) => this.entityValidator.validateSegment(segment)),
  })

  private readonly segmentUpdatedEventValidator = zod.object({
    type: zod.literal(RundownEventType.SEGMENT_UPDATED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    segment: zod
      .object({})
      .passthrough()
      .transform((segment: unknown) => this.entityValidator.validateSegment(segment)),
  })

  private readonly segmentDeletedEventValidator = zod.object({
    type: zod.literal(RundownEventType.SEGMENT_DELETED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    segmentId: zod.string().min(1),
  })

  private readonly segmentUnsyncedEventValidator = zod.object({
    type: zod.literal(RundownEventType.SEGMENT_UNSYNCED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    unsyncedSegment: zod
      .object({})
      .passthrough()
      .transform((segment: unknown) => this.entityValidator.validateSegment(segment)),
    originalSegmentId: zod.string().min(1),
  })

  private readonly partCreatedEventValidator = zod.object({
    type: zod.literal(RundownEventType.PART_CREATED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    part: zod
      .object({})
      .passthrough()
      .transform((part: unknown) => this.entityValidator.validatePart(part)),
  })

  private readonly partUpdatedEventValidator = zod.object({
    type: zod.literal(RundownEventType.PART_UPDATED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    part: zod
      .object({})
      .passthrough()
      .transform((part: unknown) => this.entityValidator.validatePart(part)),
  })

  private readonly partDeletedEventValidator = zod.object({
    type: zod.literal(RundownEventType.PART_DELETED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    segmentId: zod.string().min(1),
    partId: zod.string().min(1),
  })

  private readonly partUnsyncedEventValidator = zod.object({
    type: zod.literal(RundownEventType.PART_UNSYNCED),
    timestamp: zod.number(),
    rundownId: zod.string().min(1),
    part: zod
      .object({})
      .passthrough()
      .transform((part: unknown) => this.entityValidator.validatePart(part)),
  })

  constructor(private readonly entityValidator: EntityValidator) {}

  public validateRundownActivatedEvent(event: unknown): RundownActivatedEvent {
    return this.rundownActivatedEventValidator.parse(event)
  }
  public validateRundownDeactivatedEvent(event: unknown): RundownDeactivatedEvent {
    return this.rundownDeactivatedEventValidator.parse(event)
  }

  public validateRundownResetEvent(event: unknown): RundownResetEvent {
    return this.rundownResetEventValidator.parse(event)
  }

  public validateTakenEvent(event: unknown): PartTakenEvent {
    return this.rundownTakenEventValidator.parse(event)
  }

  public validateSetNextEvent(event: unknown): PartSetAsNextEvent {
    return this.rundownSetNextEventValidator.parse(event)
  }

  public validateInfinitePiecesUpdatedEvent(event: unknown): RundownInfinitePiecesUpdatedEvent {
    return this.rundownInfinitePiecesUpdatedEventValidator.parse(event)
  }

  public validatePartInsertedAsOnAirEvent(event: unknown): RundownPartInsertedAsOnAirEvent {
    return this.rundownPartInsertedAsOnAirEventValidator.parse(event)
  }

  public validatePartInsertedAsNextEvent(event: unknown): RundownPartInsertedAsNextEvent {
    return this.rundownPartInsertedAsNextEventValidator.parse(event)
  }

  public validatePieceInsertedEvent(event: unknown): RundownPieceInsertedEvent {
    return this.rundownPieceInsertedEventValidator.parse(event)
  }

  public validateRundownCreatedEvent(event: unknown): RundownCreatedEvent {
    return this.rundownCreatedEventValidator.parse(event)
  }

  public validateRundownUpdatedEvent(event: unknown): RundownUpdatedEvent {
    return this.rundownUpdatedEventValidator.parse(event)
  }

  public validateRundownDeletedEvent(event: unknown): RundownDeletedEvent {
    return this.rundownDeletedEventValidator.parse(event)
  }

  public validateSegmentCreatedEvent(event: SegmentCreatedEvent): SegmentCreatedEvent {
    return this.segmentCreatedEventValidator.parse(event)
  }

  public validateSegmentUpdatedEvent(event: SegmentUpdatedEvent): SegmentUpdatedEvent {
    return this.segmentUpdatedEventValidator.parse(event)
  }

  public validateSegmentDeletedEvent(event: SegmentDeletedEvent): SegmentDeletedEvent {
    return this.segmentDeletedEventValidator.parse(event)
  }

  public validateSegmentUnsyncedEvent(event: unknown): SegmentUnsyncedEvent {
    return this.segmentUnsyncedEventValidator.parse(event)
  }

  public validatePartCreatedEvent(event: unknown): PartCreatedEvent {
    return this.partCreatedEventValidator.parse(event)
  }

  public validatePartUpdatedEvent(event: unknown): PartUpdatedEvent {
    return this.partUpdatedEventValidator.parse(event)
  }

  public validatePartDeletedEvent(event: unknown): PartDeletedEvent {
    return this.partDeletedEventValidator.parse(event)
  }

  public validatePartUnsyncedEvent(event: unknown): PartUnsyncedEvent {
    return this.partUnsyncedEventValidator.parse(event)
  }
}
