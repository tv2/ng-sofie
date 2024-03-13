import { Segment } from './segment'
import { Piece } from './piece'
import { RundownTiming } from './rundown-timing'
import { RundownMode } from '../enums/rundown-mode'

export interface Rundown {
  readonly id: string
  readonly name: string
  readonly mode: RundownMode
  readonly modifiedAt: number
  readonly segments: Segment[]
  readonly infinitePieces: Piece[]
  readonly timing: RundownTiming
}
