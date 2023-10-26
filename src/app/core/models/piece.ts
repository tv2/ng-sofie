import { Tv2PieceType } from '../enums/tv2-piece-type'
import { Tv2OutputLayer } from './tv2-output-layer'

export interface Piece {
  readonly id: string
  readonly type: Tv2PieceType
  readonly outputLayer: Tv2OutputLayer
  readonly partId: string
  readonly name: string
  readonly layer: string
  readonly start: number
  readonly duration?: number
  readonly isPlanned: boolean
  readonly hasContent: boolean
}
