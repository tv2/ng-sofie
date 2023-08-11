import { Piece } from './piece'

export interface AdLibPiece extends Piece {
  start: number
  duration: number
}
