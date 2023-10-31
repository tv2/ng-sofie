import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, ViewChild } from '@angular/core'
import { Piece } from '../../../core/models/piece'
import { Tv2Piece } from '../../../core/models/tv2-piece'

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
  public playedDurationForPartInMs: number

  @Input()
  public offsetInMs: number

  @Input()
  public availableDisplayDurationForPieceInMs: number

  @HostBinding('style.width.px')
  public get availableWidthInPixels(): number {
    return Math.floor(this.availableDisplayDurationForPieceInMs * this.pixelsPerSecond / 1000)
  }

  @HostBinding('attr.title')
  public get pieceName(): string {
    return this.piece.name
  }

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
    return this.convertDurationToPixels(displayOffsetInMs)
  }

  public getPieceDisplayWidthInPixels(): number {
    return this.convertDurationToPixels(this.getPieceDisplayDurationInMs())
  }

  private getPieceDisplayDurationInMs(): number {
    const pieceDurationInMs: number | undefined = this.piece.duration
    if (pieceDurationInMs === undefined) {
      return this.availableDisplayDurationForPieceInMs
    }
    const playedPieceDisplayDurationInMs: number = Math.max(0, this.playedDurationForPartInMs - this.piece.start - this.prePlayheadDurationInMs)
    return pieceDurationInMs - playedPieceDisplayDurationInMs
  }

  private getPlayedPieceDuration(): number {
    return Math.max(0, this.playedDurationForPartInMs - this.piece.start)
  }

  public getLabelOffsetInPixels(): number {
    const labelFadeInOffsetInMs: number = Math.min(this.getPlayedPieceDuration(), this.prePlayheadDurationInMs)
    const labelDisplayOffsetInMs: number = labelFadeInOffsetInMs - this.getDurationLeftAfterLabelTextEndsInMs()
    return this.convertDurationToPixels(labelDisplayOffsetInMs)
  }

  private getDurationLeftAfterLabelTextEndsInMs(): number {
    const pieceDuration: number | undefined = this.piece.duration
    if (!pieceDuration) {
      return 0
    }
    const labelTextWidthInPixels: number = this.labelTextElement?.nativeElement.offsetWidth ?? 0
    const labelTextDurationInMs: number = this.convertPixelsToDuration(labelTextWidthInPixels + LABEL_TEXT_INSET_IN_PIXELS)
    const clippedLabelTextDurationInMs: number = Math.min(labelTextDurationInMs, pieceDuration)
    return Math.max(0, this.getPlayedPieceDuration() + clippedLabelTextDurationInMs - pieceDuration)
  }

  private convertDurationToPixels(durationInMs: number): number {
    return Math.round(durationInMs * this.pixelsPerSecond / 1000)
  }

  private convertPixelsToDuration(pixels: number): number {
    return pixels * 1000 / this.pixelsPerSecond
  }

  @HostBinding('class')
  public get getPieceTypeModifierClass(): string {
    return (this.piece as Tv2Piece).metadata.type.toLowerCase().replace(/_/g, '-')
  }
}

