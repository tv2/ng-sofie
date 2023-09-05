import { RundownEventType } from './rundown-event-type'
import { AdLibPiece } from './ad-lib-piece'
import { Piece } from './piece'

export interface RundownEvent {
  type: RundownEventType
  rundownId: string
}

export interface PartEvent extends RundownEvent {
  segmentId: string
  partId: string
}

export interface RundownActivatedEvent extends PartEvent {
  type: RundownEventType.ACTIVATED
}

export interface RundownDeactivatedEvent extends RundownEvent {
  type: RundownEventType.DEACTIVATED
}

export interface RundownResetEvent extends RundownEvent {
  type: RundownEventType.RESET
}

export interface RundownTakenEvent extends PartEvent {
  type: RundownEventType.TAKEN
}

export interface RundownSetNextEvent extends PartEvent {
  type: RundownEventType.SET_NEXT
}

export interface RundownAdLibPieceInserted extends PartEvent {
  type: RundownEventType.AD_LIB_PIECE_INSERTED,
  adLibPiece: AdLibPiece
}

export interface RundownInfinitePieceAddedEvent extends PartEvent {
  type: RundownEventType.INFINITE_PIECE_ADDED,
  infinitePiece: Piece
}
