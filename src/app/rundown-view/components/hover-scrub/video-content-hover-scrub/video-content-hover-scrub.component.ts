import { Component, ElementRef, Input, OnChanges, SimpleChange, SimpleChanges, ViewChild } from '@angular/core'
import { HoverScrubElementSize, VideoHoverScrubPositonsAndMoment } from '../hover-scrub/hover-scrub.component'
import { Tv2PieceType } from 'src/app/core/enums/tv2-piece-type'
import { PieceLifespan } from 'src/app/core/models/piece-lifespan'

const ROUNDING_PRECISION: number = 100

@Component({
  selector: 'sofie-video-content-hover-scrub',
  templateUrl: './video-content-hover-scrub.component.html',
  styleUrls: ['./video-content-hover-scrub.component.scss'],
})
export class VideoContentHoverScrubComponent implements OnChanges {
  @Input() public hoverScrubVideoSource: string
  @Input() public fileName: string
  @Input() public type: Tv2PieceType
  @Input() public pieceLifespan?: PieceLifespan
  @Input() public hoverScrubElementSize: HoverScrubElementSize
  @Input() public videoHoverScrubPositonsAndMoment: VideoHoverScrubPositonsAndMoment
  @Input() public hoverScrubTooltipElemen: HTMLElement

  public readonly videoContainerWidth = 160
  public currentVideoTimeInS: number
  public videoDurationInS: number
  private isVideoContentAppended: boolean = false

  @ViewChild('videoTooltipElementRef')
  public videoTooltipElementRef: ElementRef<HTMLDivElement>

  @ViewChild('viceoElementRef')
  public viceoElementRef: ElementRef<HTMLVideoElement>

  public ngOnChanges(changes: SimpleChanges): void {
    const videoHoverScrubPositonsAndMomentChange: SimpleChange | undefined = changes['videoHoverScrubPositonsAndMoment']
    if (!videoHoverScrubPositonsAndMomentChange) {
      return
    }
    if (this.videoTooltipElementRef && !this.isVideoContentAppended) {
      this.appendVideoContentToHoverScrubTooltip()
    }
    this.setNewTimeForVideoElement()
  }

  private appendVideoContentToHoverScrubTooltip(): void {
    this.isVideoContentAppended = true
    this.hoverScrubTooltipElemen.appendChild(this.videoTooltipElementRef.nativeElement)
  }

  private setNewTimeForVideoElement(): void {
    if (!this.viceoElementRef?.nativeElement.duration) {
      return
    }

    if (this.videoHoverScrubPositonsAndMoment.isShown) {
      const videoDuration: number = Math.round(this.viceoElementRef.nativeElement.duration * ROUNDING_PRECISION) / ROUNDING_PRECISION
      this.videoDurationInS = videoDuration
      this.currentVideoTimeInS = this.getCurrentTimeBasedOnCursor(
        videoDuration,
        this.videoHoverScrubPositonsAndMoment.cursorLocationInPercent,
        this.videoHoverScrubPositonsAndMoment.playedDurationInMs ? this.videoHoverScrubPositonsAndMoment.playedDurationInMs / 1000 : 0
      )
      this.viceoElementRef.nativeElement.currentTime = this.currentVideoTimeInS
    }
  }

  private getCurrentTimeBasedOnCursor(videoDuration: number, userCursorInPercent: number, playedDurationInS: number): number {
    const videoDurationWithoutPlayedDuration = videoDuration - playedDurationInS
    return videoDurationWithoutPlayedDuration > 0
      ? Math.round((playedDurationInS + (videoDurationWithoutPlayedDuration / 100) * userCursorInPercent) * ROUNDING_PRECISION) / ROUNDING_PRECISION
      : playedDurationInS
  }

  public getTranlationForPieceLifespan(): string {
    switch (this.pieceLifespan) {
      case PieceLifespan.WITHIN_PART:
        return $localize`rundown-overview.piece-lifespan.within-part.label`
      case PieceLifespan.SPANNING_UNTIL_RUNDOWN_END:
        return $localize`rundown-overview.piece-lifespan.spanning-until-rundown-end.label`
      case PieceLifespan.SPANNING_UNTIL_SEGMENT_END:
        return $localize`rundown-overview.piece-lifespan.spanning-until-segment-end.label`
      case PieceLifespan.START_SPANNING_SEGMENT_THEN_STICKY_RUNDOWN:
        return $localize`rundown-overview.piece-lifespan.start-spanning-segment-then-sticky-rundown.label`
      case PieceLifespan.STICKY_UNTIL_RUNDOWN_CHANGE:
        return $localize`rundown-overview.piece-lifespan.sticky-until-rundown-change.label`
      case PieceLifespan.STICKY_UNTIL_SEGMENT_CHANGE:
        return $localize`rundown-overview.piece-lifespan.sticky-until-segment-change.label`
      default:
        return ''
    }
  }
}
