import { Component, Input, OnChanges, OnDestroy, SimpleChange, SimpleChanges } from '@angular/core'
import { HoverScrubElementSizes, VideoHoverScrubPositonsAndMoment } from '../hover-scrub/hover-scrub.component'

@Component({
  selector: 'sofie-video-content-hover-scrub',
  template: '',
})
export class VideoContentHoverScrubComponent implements OnChanges, OnDestroy {
  @Input() public hoverScrubVideoSrc: string
  @Input() public fileName: string
  @Input() public hoverScrubElementSizes: HoverScrubElementSizes
  @Input() public videoHoverScrubPositonsAndMoment: VideoHoverScrubPositonsAndMoment
  @Input() public hoverScrubTooltipElementRef: HTMLElement
  private videoElementRef?: HTMLVideoElement

  public ngOnChanges(changes: SimpleChanges): void {
    const videoHoverScrubPositonsAndMomentChange: SimpleChange | undefined = changes['videoHoverScrubPositonsAndMoment']
    if (!videoHoverScrubPositonsAndMomentChange) {
      return
    }
    if (!this.videoElementRef) {
      this.appendVideoToHoverScrubContainer()
    }
    this.setNewPostionsAndTimeFrame()
  }

  public ngOnDestroy(): void {
    this.resetHoverScrubContainer()
  }

  private resetHoverScrubContainer(): void {
    this.videoElementRef = undefined
    this.hoverScrubTooltipElementRef.innerHTML = ''
    this.hoverScrubTooltipElementRef.setAttribute('style', `display: none;`)
  }

  private appendVideoToHoverScrubContainer(): void {
    const videoTitle = document.createElement('p')
    videoTitle.innerText = this.fileName
    this.videoElementRef = document.createElement('video')
    this.videoElementRef.className = 'c-video-hover-scrub'
    this.videoElementRef.src = this.hoverScrubVideoSrc
    this.videoElementRef.setAttribute('style', `height: ${this.hoverScrubElementSizes.height - 30}px`)
    this.hoverScrubTooltipElementRef.appendChild(videoTitle)
    this.hoverScrubTooltipElementRef.appendChild(this.videoElementRef)
  }

  private setNewPostionsAndTimeFrame(): void {
    if (!this.videoElementRef?.duration) {
      return
    }
    if (this.videoHoverScrubPositonsAndMoment.isShown) {
      const videoDuration: number = this.videoElementRef.duration
      this.videoElementRef.currentTime = this.getCurrentTimeBasedOnUserCursor(
        videoDuration,
        this.videoHoverScrubPositonsAndMoment.whereIsUserCursorInPercent,
        this.videoHoverScrubPositonsAndMoment.playedDurationForPartInMs ? this.videoHoverScrubPositonsAndMoment.playedDurationForPartInMs / 1000 : 0
      )
      this.getCurrentPositonBaseOnUserCursor(this.videoHoverScrubPositonsAndMoment.top, this.videoHoverScrubPositonsAndMoment.left)
    } else {
      this.resetHoverScrubContainer()
    }
  }

  private getCurrentTimeBasedOnUserCursor(videoDuration: number, userCursorInPercent: number, playedDurationForPartInS: number): number {
    const roundingPrecision: number = 100
    const videoDurationWithoutPlayedDuration = videoDuration - playedDurationForPartInS
    return Math.round((playedDurationForPartInS + (videoDurationWithoutPlayedDuration / 100) * userCursorInPercent) * roundingPrecision) / roundingPrecision
  }

  private getCurrentPositonBaseOnUserCursor(topPosition: number, leftPositon: number): void {
    if (this.hoverScrubTooltipElementRef) {
      this.hoverScrubTooltipElementRef.setAttribute(
        'style',
        `top: ${topPosition}px; left: ${leftPositon}px; width: ${this.hoverScrubElementSizes.width}px; height: ${this.hoverScrubElementSizes.height}px; display: flex`
      )
    }
  }
}
