import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewChild } from '@angular/core'
import { Piece } from '../../../core/models/piece'

@Component({
  selector: 'sofie-offsetable-piece',
  templateUrl: './offsetable-piece.component.html',
  styleUrls: ['./offsetable-piece.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffsetablePieceComponent {
  @Input()
  public piece: Piece

  @Input()
  public pixelsPerSecond: number

  @Input()
  public partDuration: number

  @Input()
  public playedDurationForPartInMs: number

  @Input()
  public prePlayheadDurationInMs: number

  @HostBinding('style.left.px')
  public get leftInPixels(): number {
    const offsetInMs: number = this.piece.start - Math.max(0, this.playedDurationForPartInMs - this.prePlayheadDurationInMs)
    const displayOffsetInMs: number = Math.max(0, offsetInMs)
    return displayOffsetInMs * this.pixelsPerSecond / 1000
  }

  @HostBinding('style.width.px')
  public get widthInPixels(): number {
    const displayDurationInMs: number = this.getDisplayDurationInMs()
    return Math.floor(this.pixelsPerSecond * displayDurationInMs / 1000)
  }

  private getDisplayDurationInMs(): number {
    const durationInMs: number = this.piece.duration ?? (this.partDuration - this.piece.start)
    const playedDurationForPieceInMs: number = Math.max(0, this.playedDurationForPartInMs - this.piece.start)
    return durationInMs - (playedDurationForPieceInMs - this.prePlayheadDurationInMs - 200 * 1000 / 60)
  }

  public get labelOffsetInPixels(): number {
    const playedDurationForPieceInMs: number = Math.max(0, this.playedDurationForPartInMs - this.piece.start)
    const displayOffsetInMs: number = Math.min(playedDurationForPieceInMs, this.prePlayheadDurationInMs)
    return displayOffsetInMs * this.pixelsPerSecond / 1000
  }

  @HostBinding('class')
  public get getPieceTypeModifierClass(): string {
    return this.getPieceType()
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
