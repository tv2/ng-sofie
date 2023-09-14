import {Component, Input} from '@angular/core'
import { Piece } from '../../../core/models/piece'
import { offsetSegment } from '@angular/compiler-cli/src/ngtsc/sourcemaps/src/segment_marker'

const DEFAULT_PIECE_DURATION = 4000
const MAX_VISUAL_DURATION = 15000

@Component({
  selector: 'sofie-piece',
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.scss']
})
export class PieceComponent {

  @Input()
  public piece: Piece

  @Input()
  public pixelsPerSecond: number

  @Input()
  public maxDuration: number

  constructor() { }

  public getPieceWidthInPixels(): string {
    const width = this.getPieceWidth()
    return `${width}px`
  }

  private getPieceWidth(): number {
    const pieceDuration = this.piece.duration ?? (this.maxDuration - this.piece.start)
    const effectivePieceDuration = Math.max(pieceDuration, DEFAULT_PIECE_DURATION)

    return Math.floor(this.pixelsPerSecond * effectivePieceDuration / 1000)
  }

  public getOffsetInPixels(): string {
    const offset = this.getOffset()
    return `${offset}px`
  }

  private getOffset(): number {
    return Math.floor(this.pixelsPerSecond * (this.piece.start ?? 0) / 1000)
  }

  public getPieceTypeModifierClass(): string {
    const pieceType = this.getPieceType()
    return `piece--${pieceType}`
  }

  public getPieceType(): string {
    const layerType = this.piece.layer.replace(/^studio\d+_/, '')
    switch (layerType) {
      case 'camera':
        return 'camera'
      case 'graphicsLower':
      case 'graphicsIdent':
      case 'graphicsHeadline':
      case 'graphicsTop':
        return 'lower-third'
      case 'graphicsTelefon':
      case 'selected_graphicsFull':
      case 'graphicsTema':
      case 'overlay':
      case 'pilot':
      case 'pilotOverlay':
      case 'wall_graphics':
      case 'graphic_show_lifecycle':
        return 'graphics'
      case 'live':
        return 'remote'
      case 'clip':
      case 'selected-clip':
        return 'clip'
      case 'voiceover':
      case 'selected_voiceover':
        return 'live-speak'
      case 'local':
        return 'local'
      default:
        return 'unknown'
    }
  }
}
