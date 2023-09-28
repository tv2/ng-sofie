import {Component, Input} from '@angular/core'
import { Piece } from '../../../core/models/piece'

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
  public partDuration: number

  @Input()
  public expectedPartDuration: number

  public getPieceWidthInPixels(): string {
    const width = this.getPieceWidth()
    return `${width}px`
  }

  private getPieceWidth(): number {
    const duration  = this.piece.duration ?? (this.partDuration - this.piece.start)
    return Math.floor(this.pixelsPerSecond * duration / 1000)
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

  // TODO: Use either piece.type or source layer types for determining style.
  public getPieceType(): string {
    const layerType = this.piece.layer.replace(/^studio\d+_/, '')
    switch (layerType) {
      case 'camera':
        return 'camera'
      case 'script':
        return 'manus'
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
      case 'dve':
      case 'dve_adlib':
        return 'dve'
      default:
        return 'unknown'
    }
  }
}
