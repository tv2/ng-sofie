import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, ViewChild } from '@angular/core'
import { Piece } from '../../../core/models/piece'

const LABEL_TEXT_INSET_IN_PIXELS: number = 14

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

  @Input()
  public postPlayheadDurationInMs: number

  @ViewChild('labelTextElement')
  public labelTextElement: ElementRef<HTMLSpanElement>

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
    const durationInMs: number = this.piece.duration ?? (this.partDuration - this.piece.start + this.prePlayheadDurationInMs + this.postPlayheadDurationInMs)
    const playedDurationForPieceInMs: number = Math.max(0, this.playedDurationForPartInMs - this.piece.start - this.prePlayheadDurationInMs)
    return durationInMs - (playedDurationForPieceInMs)
  }

  public get labelOffsetInPixels(): number {
    const playedDurationForPieceInMs: number = Math.max(0, this.playedDurationForPartInMs - this.piece.start)
    const displayOffsetInMs: number = Math.min(playedDurationForPieceInMs, this.prePlayheadDurationInMs)
    const displayOffsetWithLabelTextOffsetInMs: number = displayOffsetInMs - this.getDurationInMsSpendAfterLabelTextEnds()
    return displayOffsetWithLabelTextOffsetInMs * this.pixelsPerSecond / 1000
  }

  public getDurationInMsSpendAfterLabelTextEnds(): number {
    if (!this.piece.duration) {
      return 0
    }

    const labelTextWidthInPixels: number = this.labelTextElement?.nativeElement.offsetWidth
    if (!labelTextWidthInPixels) {
      return 0
    }

    const labelTextDurationInMs: number = (labelTextWidthInPixels + LABEL_TEXT_INSET_IN_PIXELS) * 1000 / this.pixelsPerSecond
    const playedDurationForPieceInMs: number = Math.max(0, this.playedDurationForPartInMs - this.piece.start)
    if (labelTextDurationInMs > this.piece.duration) {
      return -Math.min(0, this.piece.duration - playedDurationForPieceInMs)
    }
    return Math.max(0, playedDurationForPieceInMs + labelTextDurationInMs - this.piece.duration)
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
