import { Component, Input, OnChanges, OnDestroy, SimpleChange, SimpleChanges } from '@angular/core'
import { HoverScrubElementSizes, VideoHoverScrubPositonsAndMoment } from '../hover-scrub/hover-scrub.component'

@Component({
  selector: 'sofie-video-content-hover-scrub',
  template: '',
})
export class VideoContentHoverScrubComponent implements OnChanges, OnDestroy {
  @Input() public hoverScrubVideoSrc: string
  @Input() public fileName: string
  @Input() public type: string
  @Input() public hoverScrubElementSizes: HoverScrubElementSizes
  @Input() public videoHoverScrubPositonsAndMoment: VideoHoverScrubPositonsAndMoment
  @Input() public hoverScrubTooltipElemen: HTMLElement
  private videoElementRef?: HTMLVideoElement

  public ngOnChanges(changes: SimpleChanges): void {
    const videoHoverScrubPositonsAndMomentChange: SimpleChange | undefined = changes['videoHoverScrubPositonsAndMoment']
    if (!videoHoverScrubPositonsAndMomentChange) {
      return
    }
    if (!this.videoElementRef) {
      this.appendVideoToHoverScrubContainer()
    }
    this.setNewTimeForVideoElement()
  }

  public ngOnDestroy(): void {
    this.resetHoverScrubContainer()
  }

  private resetHoverScrubContainer(): void {
    this.hoverScrubTooltipElemen.innerHTML = ''
    this.videoElementRef = undefined
  }

  private appendVideoToHoverScrubContainer(): void {
    const videoTitle = document.createElement('p')
    videoTitle.className = `${this.type.toLocaleLowerCase()}_color`
    videoTitle.innerText = this.fileName
    this.videoElementRef = document.createElement('video')
    this.videoElementRef.className = `c-video-hover-scrub`
    this.videoElementRef.src = this.hoverScrubVideoSrc
    this.videoElementRef.setAttribute('style', `height: ${this.hoverScrubElementSizes.height - 35}px`)
    this.hoverScrubTooltipElemen.appendChild(videoTitle)
    this.hoverScrubTooltipElemen.appendChild(this.videoElementRef)
  }

  private setNewTimeForVideoElement(): void {
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
    } else {
      this.resetHoverScrubContainer()
    }
  }

  private getCurrentTimeBasedOnUserCursor(videoDuration: number, userCursorInPercent: number, playedDurationForPartInS: number): number {
    const roundingPrecision: number = 100
    const videoDurationWithoutPlayedDuration = videoDuration - playedDurationForPartInS
    return Math.round((playedDurationForPartInS + (videoDurationWithoutPlayedDuration / 100) * userCursorInPercent) * roundingPrecision) / roundingPrecision
  }
}
