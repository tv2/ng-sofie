import { Component, ElementRef, Input, OnChanges, SimpleChange, SimpleChanges, ViewChild } from '@angular/core'
import { HoverScrubElementSize, VideoHoverScrubPositonsAndMoment } from '../hover-scrub/hover-scrub.component'
import { Tv2PieceType } from 'src/app/core/enums/tv2-piece-type'

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
  @Input() public hoverScrubElementSize: HoverScrubElementSize
  @Input() public videoHoverScrubPositonsAndMoment: VideoHoverScrubPositonsAndMoment
  @Input() public hoverScrubTooltipElemen: HTMLElement

  private isVideoContentAppended: boolean = false

  @ViewChild('videoElementRef')
  public videoElementRef: ElementRef<HTMLVideoElement>

  @ViewChild('videoTitleRef')
  public videoTitleRef: ElementRef<HTMLParagraphElement>

  public ngOnChanges(changes: SimpleChanges): void {
    const videoHoverScrubPositonsAndMomentChange: SimpleChange | undefined = changes['videoHoverScrubPositonsAndMoment']
    if (!videoHoverScrubPositonsAndMomentChange) {
      return
    }
    if (this.videoTitleRef && this.videoElementRef && !this.isVideoContentAppended) {
      this.appendVideoContentToHoverScrubTooltip()
    }
    this.setNewTimeForVideoElement()
  }

  private appendVideoContentToHoverScrubTooltip(): void {
    this.isVideoContentAppended = true
    this.hoverScrubTooltipElemen.appendChild(this.videoTitleRef.nativeElement)
    this.hoverScrubTooltipElemen.appendChild(this.videoElementRef.nativeElement)
  }

  private setNewTimeForVideoElement(): void {
    if (!this.videoElementRef?.nativeElement.duration) {
      return
    }

    if (this.videoHoverScrubPositonsAndMoment.isShown) {
      const videoDuration: number = this.videoElementRef.nativeElement.duration
      this.videoElementRef.nativeElement.currentTime = this.getCurrentTimeBasedOnCursor(
        videoDuration,
        this.videoHoverScrubPositonsAndMoment.cursorLocationInPercent,
        this.videoHoverScrubPositonsAndMoment.playedDurationInMs ? this.videoHoverScrubPositonsAndMoment.playedDurationInMs / 1000 : 0
      )
    }
  }

  private getCurrentTimeBasedOnCursor(videoDuration: number, userCursorInPercent: number, playedDurationInS: number): number {
    const videoDurationWithoutPlayedDuration = videoDuration - playedDurationInS
    return Math.round((playedDurationInS + (videoDurationWithoutPlayedDuration / 100) * userCursorInPercent) * ROUNDING_PRECISION) / ROUNDING_PRECISION
  }

  // private resetHoverScrubContainer(): void {
  //   this.isVideoContentAppended = false
  //   this.hoverScrubTooltipElemen.innerHTML = ''
  // }

  // public ngOnDestroy(): void {
  //   this.resetHoverScrubContainer()
  // }
}
