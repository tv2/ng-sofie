import { Segment } from './segment'
import { Piece } from './piece'

export interface Rundown {
  readonly id: string
  readonly name: string
  readonly isActive: boolean
  readonly modifiedAt: number
  readonly segments: Segment[]
  readonly infinitePieces: Piece[]
}
