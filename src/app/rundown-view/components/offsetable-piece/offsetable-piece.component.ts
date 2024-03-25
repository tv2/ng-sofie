import { Tv2Piece } from 'src/app/core/models/tv2-piece'
import { Component, ElementRef, HostBinding, Input, OnChanges, OnDestroy, SimpleChange, SimpleChanges, ViewChild } from '@angular/core'
import { Tv2AudioMode } from '../../../core/enums/tv2-audio-mode'
import { MediaStateService } from '../../../shared/services/media-state.service'
import { Media } from '../../../shared/services/media'
import { Subscription } from 'rxjs'
import { Piece } from 'src/app/core/models/piece'
import { TooltipMetadata } from '../../../shared/directives/tooltip.directive'

const LABEL_TEXT_INSET_IN_PIXELS: number = 14

@Component({
  selector: 'sofie-offsetable-piece',
  templateUrl: './offsetable-piece.component.html',
  styleUrls: ['./offsetable-piece.component.scss'],
})
export class OffsetablePieceComponent implements OnChanges, OnDestroy {
  @Input()
  public piece: Piece

  @Input()
  public pixelsPerSecond: number

  @Input()
  public partDuration: number

  @Input()
  public playedDurationForPartInMs: number = 0

  @Input()
  public prePlayheadDurationInMs: number

  @Input()
  public postPlayheadDurationInMs: number

  @ViewChild('labelTextElement')
  public labelTextElement: ElementRef<HTMLSpanElement>

  public media?: Media

  public positionInVideoInMs: number = 0

  private mediaSubscription?: Subscription

  constructor(private readonly mediaStateService: MediaStateService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    const pieceChange: SimpleChange | undefined = changes['piece']
    if (pieceChange) {
      this.updatePiecesFromPartChange(pieceChange)
    }
  }

  public updatePositionInVideo(tooltipMetadata: TooltipMetadata): void {
    const positionInVideoInPercent: number = tooltipMetadata.horizontalOffsetInPixels / this.widthInPixels
    const videoDurationWithoutPlayedDurationInMs: number = Math.max(this.partDuration - this.playedDurationForPartInMs, 0)
    this.positionInVideoInMs = Math.round(this.playedDurationForPartInMs + videoDurationWithoutPlayedDurationInMs * positionInVideoInPercent)
  }

  private updatePiecesFromPartChange(pieceChange: SimpleChange): void {
    const previousMediaSourceName: string | undefined = pieceChange.previousValue ? this.getPieceMediaSourceName(pieceChange.previousValue) : undefined
    if (previousMediaSourceName === this.getPieceMediaSourceName(pieceChange.currentValue)) {
      return
    }
    this.mediaSubscription?.unsubscribe()
    this.updatePieceMedia()
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

  public get pieceTypeModifierClass(): string {
    const piece: Tv2Piece = this.piece as Tv2Piece
    return [piece.metadata.type.toLowerCase().replace(/_/g, '-'), (piece.metadata.audioMode ?? Tv2AudioMode.FULL).toLowerCase().replace('_', '-')].join(' ')
  }

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
  }

  public ngOnDestroy(): void {
    this.mediaSubscription?.unsubscribe()
  }
}
