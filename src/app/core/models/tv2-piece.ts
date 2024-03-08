import { Piece } from './piece'
import { Tv2PieceType } from '../enums/tv2-piece-type'
import { Tv2OutputLayer } from './tv2-output-layer'
import { Tv2AudioMode } from '../enums/tv2-audio-mode'

export interface Tv2Piece extends Piece {
  readonly metadata: Tv2PieceMetadata
}

export interface Tv2PieceMetadata {
  readonly type: Tv2PieceType
  readonly outputLayer?: Tv2OutputLayer
  readonly audioMode?: Tv2AudioMode
  readonly sourceName?: string
  readonly graphicTemplateName?: string
}
