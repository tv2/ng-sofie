import { RundownEventType } from './rundown-event-type'
import { Piece } from './piece'
import { TypedEvent } from '../../event-system/abstractions/event-observer.service'

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

export interface RundownCreatedEvent extends RundownEvent {
  type: RundownEventType.RUNDOWN_CREATED
}

export interface RundownUpdatedEvent extends RundownEvent {
  type: RundownEventType.RUNDOWN_UPDATED
}

export interface RundownDeletedEvent extends RundownEvent {
  type: RundownEventType.RUNDOWN_DELETED
}

export interface SegmentCreatedEvent extends RundownEvent {
  type: RundownEventType.SEGMENT_CREATED,
}

export interface SegmentUpdatedEvent extends RundownEvent {
  type: RundownEventType.SEGMENT_UPDATED,
}

export interface SegmentDeletedEvent extends RundownEvent {
  type: RundownEventType.SEGMENT_DELETED,
}

export interface PartCreatedEvent extends RundownEvent {
  type: RundownEventType.PART_CREATED
}

export interface PartUpdatedEvent extends RundownEvent {
  type: RundownEventType.PART_UPDATED
}

export interface PartDeletedEvent extends RundownEvent {
  type: RundownEventType.PART_DELETED
}
