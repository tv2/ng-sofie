import { PieceType } from '../enums/piece-type'

export interface Piece {
  id: string
  type: PieceType
  partId: string
  name: string
  layer: string
  start: number
  duration?: number
}
