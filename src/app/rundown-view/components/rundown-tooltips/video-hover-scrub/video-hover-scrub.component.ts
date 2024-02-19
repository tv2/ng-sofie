import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges, ViewChild } from '@angular/core'
import { Tv2PieceType } from 'src/app/core/enums/tv2-piece-type'
import { PieceLifespan } from 'src/app/core/models/piece-lifespan'
import { Subject, takeUntil } from 'rxjs'
import { ConfigurationService } from 'src/app/shared/services/configuration.service'
import { StudioConfiguration } from 'src/app/shared/models/studio-configuration'
import { IconButton, IconButtonSize } from 'src/app/shared/enums/icon-button'
import { TooltipMousePosition } from 'src/app/core/models/tooltips'

const ROUNDING_PRECISION: number = 100

@Component({
  selector: 'sofie-video-hover-scrub',
  templateUrl: './video-hover-scrub.component.html',
  styleUrls: ['./video-hover-scrub.component.scss'],
})
export class VideoHoverScrubComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public filename: string
  @Input() public type: Tv2PieceType
  @Input() public tooltipHoverElementWidth: number
  @Input() public tooltipElementHoverMousePosition?: TooltipMousePosition
  @Input() public pieceLifespan?: PieceLifespan
  @Input() public playedDurationInMs?: number
  @Input() public isMediaUnavailable?: boolean

  public currentVideoTimeInS: number
  public videoDurationInS: number
  public hoverScrubVideoSource: string

  @ViewChild('videoElementRef')
  public videoElementRef: ElementRef<HTMLVideoElement>

  private studioConfiguration: StudioConfiguration
  private readonly unsubscribe$: Subject<void> = new Subject<void>()

  protected readonly IconButton = IconButton
  protected readonly IconButtonSize = IconButtonSize

  constructor(private readonly configurationService: ConfigurationService) {}

  public ngOnInit(): void {
    this.configurationService
      .getStudioConfiguration()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((studioConfiguration: StudioConfiguration) => {
        this.studioConfiguration = studioConfiguration
        this.hoverScrubVideoSource = this.createVideoSource()
      })
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const tooltipElementHoverMouseEventChange: SimpleChange | undefined = changes['tooltipElementHoverMouseEvent']
    if (!tooltipElementHoverMouseEventChange) {
      return
    }

    this.setNewTimeForVideoElement(this.tooltipElementHoverMousePosition)
  }

  private setNewTimeForVideoElement(mousePosition?: TooltipMousePosition): void {
    if (!this.videoElementRef?.nativeElement.duration) {
      return
    }
    if (mousePosition) {
      const videoDuration: number = Math.round(this.videoElementRef.nativeElement.duration * ROUNDING_PRECISION) / ROUNDING_PRECISION
      this.videoDurationInS = videoDuration
      this.currentVideoTimeInS = this.getCurrentTimeBasedOnCursor(
        videoDuration,
        this.getCursorLocationInPercent(this.tooltipHoverElementWidth, mousePosition.parrentElementOffsetX),
        this.playedDurationInMs ? this.playedDurationInMs / 1000 : 0
      )
      this.videoElementRef.nativeElement.currentTime = this.currentVideoTimeInS
    }
  }

  private createVideoSource(): string {
    return `${this.studioConfiguration.settings.mediaPreviewUrl}/media/preview/${this.filename}`
  }

  private getCursorLocationInPercent(timelineWidth: number, relativeParentPostion: number): number {
    return Math.round((relativeParentPostion / timelineWidth) * 100)
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

  public ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe()
  }
}
