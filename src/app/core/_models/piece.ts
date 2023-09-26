import { PieceType } from '../enums/piece-type'

export interface Piece {
  readonly id: string
  readonly type: PieceType
  readonly partId: string
  readonly name: string
  readonly layer: string
  readonly start: number
  readonly duration?: number
}
