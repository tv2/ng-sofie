import { PieceLifespan } from './piece-lifespan'

export interface Piece {
  readonly id: string
  readonly partId: string
  readonly name: string
  readonly layer: string
  readonly start: number
  readonly duration?: number
  readonly isPlanned: boolean
  readonly isSpanning?: boolean
  readonly lifespan: PieceLifespan
  readonly metadata?: unknown
}
