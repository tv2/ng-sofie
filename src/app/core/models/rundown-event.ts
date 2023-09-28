import { RundownEventType } from './rundown-event-type'
import { AdLibPiece } from './ad-lib-piece'
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

export interface RundownDeletedEvent extends RundownEvent {
  type: RundownEventType.DELETED
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

export interface RundownAdLibPieceInsertedEvent extends RundownEvent {
  type: RundownEventType.AD_LIB_PIECE_INSERTED,
  segmentId: string
  partId: string
  adLibPiece: AdLibPiece
}

export interface RundownInfinitePieceAddedEvent extends RundownEvent {
  type: RundownEventType.INFINITE_PIECE_ADDED,
  infinitePiece: Piece
}
