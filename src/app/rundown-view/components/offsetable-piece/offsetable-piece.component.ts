import { Tv2Piece } from 'src/app/core/models/tv2-piece'
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostBinding, Input, OnChanges, OnDestroy, SimpleChange, SimpleChanges, ViewChild } from '@angular/core'
import { Tv2AudioMode } from '../../../core/enums/tv2-audio-mode'
import { MediaStateService } from '../../../shared/services/media-state.service'
import { Media } from '../../../shared/services/media'
import { Subscription } from 'rxjs'
import { Piece } from 'src/app/core/models/piece'
import { TooltipContentField } from '../../../shared/abstractions/tooltip-content-field'
import { Tv2PieceTooltipContentFieldService } from '../../services/tv2-piece-tooltip-content-field.service'
import { Tv2PieceType } from '../../../core/enums/tv2-piece-type'

const LABEL_TEXT_INSET_IN_PIXELS: number = 14

@Component({
  selector: 'sofie-offsetable-piece',
  templateUrl: './offsetable-piece.component.html',
  styleUrls: ['./offsetable-piece.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffsetablePieceComponent implements OnChanges, OnDestroy {
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

  public tooltipContentFields: TooltipContentField[]

  public media?: Media

  private mediaSubscription?: Subscription

  constructor(
    private readonly mediaStateService: MediaStateService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly tv2PieceTooltipContentFieldService: Tv2PieceTooltipContentFieldService
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    const pieceChange: SimpleChange | undefined = changes['piece']
    if (pieceChange) {
      const previousMediaSourceName: string | undefined = pieceChange.previousValue ? this.getPieceMediaSourceName(pieceChange.previousValue) : undefined
      if (previousMediaSourceName === this.getPieceMediaSourceName(pieceChange.currentValue)) {
        return
      }
      this.updatePieceTooltipContent()
      this.mediaSubscription?.unsubscribe()
      this.updatePieceMedia()
    }
  }

  public updatePieceTooltipContent(): void {
    this.tooltipContentFields = this.tv2PieceTooltipContentFieldService.getTooltipContentForPiece(this.piece, this.media, this.partDuration)
  }

  public updatePieceMedia(): void {
    if (!this.doesPieceContainMedia()) {
      return
    }
    const mediaSourceName: string = this.getPieceMediaSourceName(this.piece)
    if (!mediaSourceName) {
      return
    }
    this.mediaSubscription = this.mediaStateService.subscribeToMedia(mediaSourceName).subscribe(this.updateMediaAvailabilityStatus.bind(this))
  }

  private doesPieceContainMedia(): boolean {
    const piece: Tv2Piece = this.piece as Tv2Piece
    return !!piece.metadata.sourceName
  }

  @HostBinding('style.left.px')
  public get leftInPixels(): number {
    const offsetInMs: number = this.piece.start - Math.max(0, this.playedDurationForPartInMs - this.prePlayheadDurationInMs)
    const displayOffsetInMs: number = Math.max(0, offsetInMs)
    return (displayOffsetInMs * this.pixelsPerSecond) / 1000
  }

  @HostBinding('style.width.px')
  public get widthInPixels(): number {
    const displayDurationInMs: number = this.getDisplayDurationInMs()
    return Math.floor((this.pixelsPerSecond * displayDurationInMs) / 1000)
  }

  private getDisplayDurationInMs(): number {
    const durationInMs: number = this.piece.duration || this.getDurationForPieceWithNoEnding()
    const playedDurationForPieceInMs: number = Math.max(0, this.playedDurationForPartInMs - this.piece.start - this.prePlayheadDurationInMs)
    return durationInMs - playedDurationForPieceInMs
  }

  private getDurationForPieceWithNoEnding(): number {
    const availablePieceDurationInPartInMs: number = this.partDuration - this.piece.start
    const minimumDisplayDurationInMs: number = this.prePlayheadDurationInMs + this.postPlayheadDurationInMs
    return availablePieceDurationInPartInMs + minimumDisplayDurationInMs
  }

  public get labelOffsetInPixels(): number {
    const playedDurationForPieceInMs: number = Math.max(0, this.playedDurationForPartInMs - this.piece.start)
    const displayOffsetInMs: number = Math.min(playedDurationForPieceInMs, this.prePlayheadDurationInMs)
    const displayOffsetWithLabelTextOffsetInMs: number = displayOffsetInMs - this.getDurationInMsSpendAfterLabelTextEnds()
    return (displayOffsetWithLabelTextOffsetInMs * this.pixelsPerSecond) / 1000
  }

  public getDurationInMsSpendAfterLabelTextEnds(): number {
    if (!this.piece.duration) {
      return 0
    }

    const labelTextWidthInPixels: number = this.labelTextElement?.nativeElement.offsetWidth
    if (!labelTextWidthInPixels) {
      return 0
    }

    const labelTextDurationInMs: number = ((labelTextWidthInPixels + LABEL_TEXT_INSET_IN_PIXELS) * 1000) / this.pixelsPerSecond
    const playedDurationForPieceInMs: number = Math.max(0, this.playedDurationForPartInMs - this.piece.start)
    if (labelTextDurationInMs > this.piece.duration) {
      return -Math.min(0, this.piece.duration - playedDurationForPieceInMs)
    }
    return Math.max(0, playedDurationForPieceInMs + labelTextDurationInMs - this.piece.duration)
  }

  @HostBinding('class')
  public get getPieceTypeModifierClass(): string {
    const piece: Tv2Piece = this.piece as Tv2Piece
    return [piece.metadata.type.toLowerCase().replace(/_/g, '-'), (piece.metadata.audioMode ?? Tv2AudioMode.FULL).toLowerCase().replace('_', '-')].join(' ')
  }

  @HostBinding('class.media-unavailable')
  public get isMediaUnavailable(): boolean {
    return !!this.mediaSubscription && !this.media
  }

  public getPieceMediaSourceName(piece: Piece): string {
    const tv2Piece: Tv2Piece = piece as Tv2Piece
    return tv2Piece.metadata.sourceName ?? ''
  }

  private updateMediaAvailabilityStatus(media: Media | undefined): void {
    const piece: Tv2Piece = this.piece as Tv2Piece
    if (!piece.metadata.sourceName) {
      return
    }
    this.media = media
    this.changeDetectorRef.detectChanges()
  }

  public shouldShowTooltip(): boolean {
    const tv2Piece: Tv2Piece = this.piece as Tv2Piece
    const tooltipPieceTypes: Tv2PieceType[] = [Tv2PieceType.VIDEO_CLIP, Tv2PieceType.JINGLE, Tv2PieceType.GRAPHICS, Tv2PieceType.OVERLAY_GRAPHICS, Tv2PieceType.AUDIO, Tv2PieceType.VOICE_OVER]
    return tooltipPieceTypes.includes(tv2Piece.metadata.type)
  }

  public ngOnDestroy(): void {
    this.mediaSubscription?.unsubscribe()
  }
}
