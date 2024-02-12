import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core'
import { Observable, Subject, takeUntil } from 'rxjs'
import { Tv2PieceType } from 'src/app/core/enums/tv2-piece-type'
import { StudioConfiguration } from 'src/app/shared/models/studio-configuration'
import { ConfigurationService } from 'src/app/shared/services/configuration.service'

export interface VideoHoverScrubPositonsAndMoment {
  whereIsUserCursorInPercent: number
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
  @Input() public fileName?: string
  @Input() public hoverScrubElementWidth: number
  @Input() public hoverScrubMouseEventObservable: Observable<MouseEvent | undefined>
  @Input() public playedDurationForPartInMs: number = 0
  @Input() public type: Tv2PieceType
  public hoverScrubVideoSrc: string
  private readonly hoverScrubTopOffset = 15
  private studioConfiguration: StudioConfiguration
  public videoHoverScrubPositonsAndMoment: VideoHoverScrubPositonsAndMoment
  public hoverScrubElementSizes: HoverScrubElementSizes
  public hoverScrubTooltipElemen: HTMLDivElement
  private readonly unsubscribe$: Subject<null> = new Subject<null>()

  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  public get isVideoHoverScrub(): boolean {
    return this.type === Tv2PieceType.VIDEO_CLIP
  }

  public ngOnInit(): void {
    this.setWidthAndHeightBasedOnType()
    this.appendHoverScrubTooltipElementToBody()
    if (this.isVideoHoverScrub) {
      this.configurationService
        .getStudioConfiguration()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((studioConfiguration: StudioConfiguration) => {
          this.studioConfiguration = studioConfiguration
          this.createVideoSrc()
        })
    }
    this.hoverScrubMouseEventObservable.pipe(takeUntil(this.unsubscribe$)).subscribe(event => this.checkEventHoverScrubMouse(event))
  }

  public checkEventHoverScrubMouse(event: MouseEvent | undefined): void {
    if (event) {
      this.calculateIsUserCursorInPercent(event)
    } else {
      this.videoHoverScrubPositonsAndMoment = {
        ...this.videoHoverScrubPositonsAndMoment,
        isShown: false,
      }
      this.hideHoverElement()
    }
    this.changeDetectorRef.detectChanges()
  }

  private appendHoverScrubTooltipElementToBody(): void {
    this.hoverScrubTooltipElemen = document.createElement('div')
    this.hoverScrubTooltipElemen.className = 'c-sofie-hover-scrub-tooltip'
    const body: HTMLElement = document.getElementsByTagName('body')[0]
    body.append(this.hoverScrubTooltipElemen)
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe()
    this.hoverScrubTooltipElemen.remove()
  }

  private setWidthAndHeightBasedOnType(): void {
    this.hoverScrubElementSizes = {
      width: this.type === Tv2PieceType.VIDEO_CLIP ? 170 : 200,
      height: this.type === Tv2PieceType.VIDEO_CLIP ? 125 : 60,
    }
  }

  private createVideoSrc(): void {
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

    const elementStartPositonTop = event.pageY - event.offsetY
    const elementLeftPositonInPx: number = this.calculateHoverScrubLeftPositonBasedOnUserCursor(event.clientX, this.hoverScrubElementSizes.width)
    const elementTopPositonInPx: number = elementStartPositonTop - this.hoverScrubElementSizes.height - this.hoverScrubTopOffset

    this.videoHoverScrubPositonsAndMoment = {
      whereIsUserCursorInPercent: this.getWhereIsUserCursorInPercent(this.hoverScrubElementWidth, event.offsetX),
      playedDurationForPartInMs: this.playedDurationForPartInMs,
      isShown: true,
    }
    this.getCurrentPositonBaseOnUserCursor(elementTopPositonInPx, elementLeftPositonInPx)
  }

  private getWhereIsUserCursorInPercent(timelineWidth: number, relativeParentPostion: number): number {
    return Math.round((relativeParentPostion / timelineWidth) * 100)
  }

  private getCurrentPositonBaseOnUserCursor(topPositionInPx: number, leftPositonInPx: number): void {
    if (this.hoverScrubTooltipElemen) {
      this.hoverScrubTooltipElemen.setAttribute(
        'style',
        `top: ${topPositionInPx}px; left: ${leftPositonInPx}px; width: ${this.hoverScrubElementSizes.width}px; height: ${this.hoverScrubElementSizes.height}px; display: flex`
      )
    }
  }

  private hideHoverElement(): void {
    this.hoverScrubTooltipElemen.setAttribute('style', `display: none;`)
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
