import { Piece } from './piece'
import { AutoNext } from './auto-next'
import { Invalidity } from './invalidity'

export interface Part {
  readonly id: string
  readonly rank: number
  readonly segmentId: string
  readonly isOnAir: boolean
  readonly isNext: boolean
  readonly pieces: Piece[]
  readonly expectedDuration?: number
  readonly executedAt: number
  readonly playedDuration: number
  readonly autoNext?: AutoNext
  readonly isUnsynced: boolean
  readonly isPlanned: boolean
  readonly isUntimed: boolean
  readonly metadata?: unknown
  readonly replacedPieces: readonly Piece[]
  readonly invalidity?: Invalidity
}
