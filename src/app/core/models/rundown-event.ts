import { RundownEventType } from './rundown-event-type'
import { Piece } from './piece'
import { TypedEvent } from '../../event-system/abstractions/event-observer.service'
import { Part } from './part'
import { BasicRundown } from './basic-rundown'
import { Segment } from './segment'
import {Rundown} from "./rundown";

export interface RundownEvent extends TypedEvent {
  type: RundownEventType
  rundownId: string
}

export interface PartEvent extends RundownEvent {
  segmentId: string
  partId: string
}

export interface RundownActivatedEvent extends RundownEvent {
  type: RundownEventType.ACTIVATED
}

export interface RundownDeactivatedEvent extends RundownEvent {
  type: RundownEventType.DEACTIVATED
}

export interface RundownResetEvent extends RundownEvent {
  type: RundownEventType.RESET
}

export interface PartTakenEvent extends PartEvent {
  type: RundownEventType.TAKEN
}

export interface PartSetAsNextEvent extends PartEvent {
  type: RundownEventType.SET_NEXT
}

export interface RundownInfinitePieceAddedEvent extends RundownEvent {
  type: RundownEventType.INFINITE_PIECE_ADDED
  infinitePiece: Piece
}

export interface RundownPartInsertedAsOnAirEvent extends RundownEvent {
  type: RundownEventType.PART_INSERTED_AS_ON_AIR
  part: Part
}

export interface RundownPartInsertedAsNextEvent extends RundownEvent {
  type: RundownEventType.PART_INSERTED_AS_NEXT
  part: Part
}

export interface RundownPieceInsertedEvent extends PartEvent {
  type: RundownEventType.PIECE_INSERTED
  piece: Piece
}

export interface RundownCreatedEvent extends RundownEvent {
  type: RundownEventType.RUNDOWN_CREATED
  basicRundown: BasicRundown
  rundown: Rundown
}

export interface RundownUpdatedEvent extends RundownEvent {
  type: RundownEventType.RUNDOWN_UPDATED
  basicRundown: BasicRundown
}

export interface RundownDeletedEvent extends RundownEvent {
  type: RundownEventType.RUNDOWN_DELETED
}

export interface SegmentCreatedEvent extends RundownEvent {
  type: RundownEventType.SEGMENT_CREATED
  segment: Segment
}

export interface SegmentUpdatedEvent extends RundownEvent {
  type: RundownEventType.SEGMENT_UPDATED
  segment: Segment
}

export interface SegmentDeletedEvent extends RundownEvent {
  type: RundownEventType.SEGMENT_DELETED
  segmentId: string
}

export interface SegmentUnsyncedEvent extends RundownEvent {
  type: RundownEventType.SEGMENT_UNSYNCED
  unsyncedSegment: Segment
  originalSegmentId: string
}

export interface PartCreatedEvent extends RundownEvent {
  type: RundownEventType.PART_CREATED
  part: Part
}

export interface PartUpdatedEvent extends RundownEvent {
  type: RundownEventType.PART_UPDATED
  part: Part
}

export interface PartDeletedEvent extends RundownEvent {
  type: RundownEventType.PART_DELETED
  segmentId: string
  partId: string
}

export interface PartUnsyncedEvent extends RundownEvent {
  type: RundownEventType.PART_UNSYNCED
  part: Part
}
