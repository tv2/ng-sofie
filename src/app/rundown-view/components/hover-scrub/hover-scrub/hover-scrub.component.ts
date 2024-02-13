import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core'
import { Observable, Subject, takeUntil } from 'rxjs'
import { Tv2PieceType } from 'src/app/core/enums/tv2-piece-type'
import { PieceLifespan } from 'src/app/core/models/piece-lifespan'
import { StudioConfiguration } from 'src/app/shared/models/studio-configuration'
import { ConfigurationService } from 'src/app/shared/services/configuration.service'

export interface VideoHoverScrubPositonsAndMoment {
  cursorLocationInPercent: number
  isShown: boolean
  playedDurationInMs?: number
}

export interface HoverScrubElementSize {
  width: number
  height: number
}

export const WIDTH_FOR_VIDEO_CONTENT_IN_PX: number = 320
export const WIDTH_FOR_SINGLE_CHARACTER_IN_PX: number = 6
export const MINIMUM_CHARACTERS_FOR_START_INCREASE_WIDTH: number = 20
export const HEIGHT_FOR_VIDEO_CONTENT_IN_PX: number = 90
export const WIDTH_FOR_TEXT_CONTENT_IN_PX: number = 200
export const HEIGHT_FOR_TEXT_CONTENT_IN_PX: number = 60

@Component({
  selector: 'sofie-hover-scrub',
  templateUrl: './hover-scrub.component.html',
  styleUrls: ['./hover-scrub.component.scss'],
})
export class HoverScrubComponent implements OnInit, OnDestroy {
  @Input() public fileName: string
  @Input() public hoverScrubElementWidth: number
  @Input() public hoverScrubMouseEventObservable: Observable<MouseEvent | undefined>
  @Input() public playedDurationInMs: number = 0
  @Input() public type: Tv2PieceType
  @Input() public pieceLifespan?: PieceLifespan

  public hoverScrubVideoSource: string
  public videoHoverScrubPositonsAndMoment: VideoHoverScrubPositonsAndMoment
  public hoverScrubElementSize: HoverScrubElementSize
  public hoverScrubTooltipElemen: HTMLDivElement

  private studioConfiguration: StudioConfiguration
  private readonly hoverScrubTopOffset = 0
  private readonly unsubscribe$: Subject<null> = new Subject<null>()

  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.setWidthAndHeightBasedOnType()
    this.appendHoverScrubTooltipElementToBody()
    this.hoverScrubMouseEventObservable.pipe(takeUntil(this.unsubscribe$)).subscribe(event => this.checkEventHoverScrubMouse(event))

    if (!this.isVideoHoverScrub) {
      return
    }
    this.configurationService
      .getStudioConfiguration()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((studioConfiguration: StudioConfiguration) => {
        this.studioConfiguration = studioConfiguration
        this.createVideoSource()
      })
  }

  private setWidthAndHeightBasedOnType(): void {
    this.hoverScrubElementSize = {
      width: this.isVideoHoverScrub ? this.calculateWidth() : WIDTH_FOR_TEXT_CONTENT_IN_PX,
      height: this.isVideoHoverScrub ? HEIGHT_FOR_VIDEO_CONTENT_IN_PX : HEIGHT_FOR_TEXT_CONTENT_IN_PX,
    }
  }

  private appendHoverScrubTooltipElementToBody(): void {
    this.hoverScrubTooltipElemen = document.createElement('div')
    this.hoverScrubTooltipElemen.className = 'c-sofie-hover-scrub-tooltip'
    this.hoverScrubTooltipElemen.setAttribute('style', `width: ${this.hoverScrubElementSize.width}; height: ${this.hoverScrubElementSize.height}`)
    const body: HTMLElement = document.getElementsByTagName('body')[0]
    body.append(this.hoverScrubTooltipElemen)
  }

  public get isVideoHoverScrub(): boolean {
    return this.type === Tv2PieceType.VIDEO_CLIP
  }

  private calculateWidth(): number {
    return WIDTH_FOR_VIDEO_CONTENT_IN_PX + Math.max((this.fileName?.length - MINIMUM_CHARACTERS_FOR_START_INCREASE_WIDTH) * WIDTH_FOR_SINGLE_CHARACTER_IN_PX, 0)
  }

  private createVideoSource(): void {
    if (this.studioConfiguration?.settings.mediaPreviewUrl && this.fileName) {
      // TODO test hoverScrubVideoSource is working on stage env
      this.hoverScrubVideoSource = 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
      // this.hoverScrubVideoSource = `${this.studioConfiguration.settings.mediaPreviewUrl}/media/preview/${this.fileName}`
    }
  }

  private checkEventHoverScrubMouse(event: MouseEvent | undefined): void {
    if (event) {
      this.calculateHoverScrubLocation(event)
    } else {
      this.videoHoverScrubPositonsAndMoment = {
        ...this.videoHoverScrubPositonsAndMoment,
        isShown: false,
      }
      this.hideHoverElement()
    }
    this.changeDetectorRef.detectChanges()
  }

  private hideHoverElement(): void {
    this.hoverScrubTooltipElemen.setAttribute('style', `display: none;`)
  }

  private calculateHoverScrubLocation(event: MouseEvent): void {
    if (!this.hoverScrubVideoSource && this.isVideoHoverScrub) {
      return
    }

    const elementStartPositonTop = event.pageY - event.offsetY
    const elementLeftPositonInPx: number = this.calculateHoverScrubLeftPositonBasedOnCursor(event.clientX, this.hoverScrubElementSize.width)
    const elementTopPositonInPx: number = elementStartPositonTop - this.hoverScrubElementSize.height - this.hoverScrubTopOffset

    this.videoHoverScrubPositonsAndMoment = {
      cursorLocationInPercent: this.getCursorLocationInPercent(this.hoverScrubElementWidth, event.offsetX),
      playedDurationInMs: this.playedDurationInMs,
      isShown: true,
    }
    this.getCurrentPositonBaseOnCursor(elementTopPositonInPx, elementLeftPositonInPx)
  }

  private calculateHoverScrubLeftPositonBasedOnCursor(clientX: number, videoElementWidth: number): number {
    const windowWidth = window.innerWidth
    const leftPositonBasedOnCursor = clientX - videoElementWidth / 2
    const whereHoverScrubElementEndInPx = leftPositonBasedOnCursor + videoElementWidth
    if (whereHoverScrubElementEndInPx > windowWidth) {
      return windowWidth - videoElementWidth
    }

    return Math.max(leftPositonBasedOnCursor, 0)
  }

  private getCursorLocationInPercent(timelineWidth: number, relativeParentPostion: number): number {
    return Math.round((relativeParentPostion / timelineWidth) * 100)
  }

  private getCurrentPositonBaseOnCursor(topPositionInPx: number, leftPositonInPx: number): void {
    if (this.hoverScrubTooltipElemen) {
      this.hoverScrubTooltipElemen.setAttribute(
        'style',
        `top: ${topPositionInPx}px; left: ${leftPositonInPx}px; width: ${this.hoverScrubElementSize.width}px; height: ${this.hoverScrubElementSize.height}px; display: flex`
      )
    }
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe()
    this.hoverScrubTooltipElemen.remove()
  }
}
