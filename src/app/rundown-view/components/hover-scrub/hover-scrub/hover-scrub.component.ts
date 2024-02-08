import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Subscription } from 'rxjs'
import { Tv2PieceType } from 'src/app/core/enums/tv2-piece-type'
import { StudioConfiguration } from 'src/app/shared/models/studio-configuration'
import { ConfigurationService } from 'src/app/shared/services/configuration.service'

export interface VideoHoverScrubPositonsAndMoment {
  whereIsUserCursorInPercent: number
  top: number
  left: number
  isShown: boolean
  playedDurationForPartInMs?: number
}

export interface HoverScrubElementSizes {
  width: number
  height: number
}

@Component({
  selector: 'sofie-hover-scrub',
  templateUrl: './hover-scrub.component.html',
  styleUrls: ['./hover-scrub.component.scss'],
})
export class HoverScrubComponent implements OnInit, OnDestroy {
  @Input() public playedDurationForPartInMs: number
  @Input() public type: string
  @Input() public fileName?: string
  public hoverScrubVideoSrc: string
  private readonly hoverScrubTopOffset = 15
  private readonly timeoutDurationAfterMouseMoveInMs = 5
  private studioConfiguration: StudioConfiguration
  private configurationServiceSubscription: Subscription
  private timeoutAfterMouseMove?: NodeJS.Timeout
  public videoHoverScrubPositonsAndMoment: VideoHoverScrubPositonsAndMoment
  public hoverScrubElementSizes: HoverScrubElementSizes
  @ViewChild('hoverScrubElement')
  public hoverScrubElement: ElementRef<HTMLDivElement>
  public hoverScrubTooltipElementRef: HTMLDivElement

  constructor(private readonly configurationService: ConfigurationService) {}

  public get isVideoHoverScrub(): boolean {
    return this.type === Tv2PieceType.VIDEO_CLIP
  }

  public onMouseEnterInVideoTimeline(event: MouseEvent): void {
    this.calculateIsUserCursorInPercent(event)
  }

  public onMouseMoveInVideoTimeline(event: MouseEvent): void {
    this.calculateIsUserCursorInPercent(event)
  }

  public onMouseLeaveInVideoTimeline(): void {
    this.videoHoverScrubPositonsAndMoment = {
      ...this.videoHoverScrubPositonsAndMoment,
      isShown: false,
    }
  }

  public ngOnInit(): void {
    this.setWidthAndHeightBasedOnType()
    this.appendHoverScrubTooltipElementToBody()
    if (this.isVideoHoverScrub) {
      this.configurationServiceSubscription = this.configurationService.getStudioConfiguration().subscribe((studioConfiguration: StudioConfiguration) => {
        this.studioConfiguration = studioConfiguration
        this.setVideoSrc()
      })
    }
  }

  private appendHoverScrubTooltipElementToBody(): void {
    this.hoverScrubTooltipElementRef = document.createElement('div')
    this.hoverScrubTooltipElementRef.className = 'c-sofie-hover-scrub-tooltip'
    const body: HTMLElement = document.getElementsByTagName('body')[0]
    body.append(this.hoverScrubTooltipElementRef)
  }

  public ngOnDestroy(): void {
    this.configurationServiceSubscription?.unsubscribe()
    this.hoverScrubTooltipElementRef.remove()
  }

  private setWidthAndHeightBasedOnType(): void {
    this.hoverScrubElementSizes = {
      width: this.type === Tv2PieceType.VIDEO_CLIP ? 170 : 200,
      height: this.type === Tv2PieceType.VIDEO_CLIP ? 120 : 60,
    }
  }

  private setVideoSrc(): void {
    if (this.studioConfiguration?.settings.mediaPreviewUrl && this.fileName) {
      // TODO test hoverScrubVideoSrc is working on stage env
      // this.hoverScrubVideoSrc = 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
      this.hoverScrubVideoSrc = `${this.studioConfiguration.settings.mediaPreviewUrl}/media/preview/${this.fileName}`
    }
  }

  private calculateIsUserCursorInPercent(event: MouseEvent): void {
    if (!this.hoverScrubVideoSrc && this.isVideoHoverScrub) {
      return
    }
    if (this.timeoutAfterMouseMove) {
      clearTimeout(this.timeoutAfterMouseMove)
    }
    const elementStartPositonTop = event.pageY - event.offsetY
    const elementWidth = this.hoverScrubElement.nativeElement.clientWidth
    this.timeoutAfterMouseMove = setTimeout(() => {
      this.videoHoverScrubPositonsAndMoment = {
        left: this.calculateHoverScrubLeftPositonBasedOnUserCursor(event.clientX, this.hoverScrubElementSizes.width),
        top: elementStartPositonTop - this.hoverScrubElementSizes.height - this.hoverScrubTopOffset,
        whereIsUserCursorInPercent: this.getWhereIsUserCursorInPercent(elementWidth, event.offsetX),
        playedDurationForPartInMs: this.playedDurationForPartInMs,
        isShown: true,
      }
    }, this.timeoutDurationAfterMouseMoveInMs)
  }

  private getWhereIsUserCursorInPercent(timelineWidth: number, relativeParentPostion: number): number {
    return Math.round((relativeParentPostion / timelineWidth) * 100)
  }

  private calculateHoverScrubLeftPositonBasedOnUserCursor(clientX: number, videoElementWidth: number): number {
    const windowWidth = window.innerWidth
    const leftPositonBasedOnUserCursor = clientX - videoElementWidth / 2
    const whereHoverScrubElementEndInPx = leftPositonBasedOnUserCursor + videoElementWidth
    if (whereHoverScrubElementEndInPx > windowWidth) {
      return windowWidth - videoElementWidth
    }
    if (leftPositonBasedOnUserCursor < 0) {
      return 0
    }
    return leftPositonBasedOnUserCursor
  }
}
