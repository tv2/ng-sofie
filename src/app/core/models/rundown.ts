import { Segment } from './segment'
import { Piece } from './piece'
import { BasicRundown } from './basic-rundown'

export interface Rundown extends BasicRundown {
  readonly segments: Segment[]
  readonly infinitePieces: Piece[]
}
