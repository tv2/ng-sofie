import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges, ViewChild } from '@angular/core'
import { Subject, takeUntil } from 'rxjs'
import { ConfigurationService } from 'src/app/shared/services/configuration.service'
import { StudioConfiguration } from 'src/app/shared/models/studio-configuration'
import { IconButton, IconButtonSize } from 'src/app/shared/enums/icon-button'
import { TooltipMousePosition } from 'src/app/core/models/tooltips'

@Component({
  selector: 'sofie-video-hover-scrub',
  templateUrl: './video-hover-scrub.component.html',
  styleUrls: ['./video-hover-scrub.component.scss'],
})
export class VideoHoverScrubComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public filename: string
  @Input() public tooltipHoverElementWidth: number
  @Input() public tooltipElementHoverMousePosition?: TooltipMousePosition
  @Input() public playedDurationInMs?: number

  public currentVideoTimeInMs: number
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
    const tooltipElementHoverMousePositionChange: SimpleChange | undefined = changes['tooltipElementHoverMousePosition']
    if (!tooltipElementHoverMousePositionChange) {
      return
    }

    this.setNewTimeForVideoElement(this.tooltipElementHoverMousePosition)
  }

  private setNewTimeForVideoElement(mousePosition?: TooltipMousePosition): void {
    if (!this.videoElementRef?.nativeElement.duration) {
      return
    }
    if (mousePosition) {
      const videoDurationInMs: number = this.videoElementRef.nativeElement.duration * 1000
      this.currentVideoTimeInMs = this.getCurrentTimeBasedOnCursor(
        videoDurationInMs,
        this.getCursorLocationInPercent(this.tooltipHoverElementWidth, mousePosition.parrentElementOffsetX),
        this.playedDurationInMs ? this.playedDurationInMs : 0
      )
      this.videoElementRef.nativeElement.currentTime = this.currentVideoTimeInMs
    }
  }

  private createVideoSource(): string {
    return `${this.studioConfiguration.settings.mediaPreviewUrl}/media/preview/${this.filename}`
  }

  private getCursorLocationInPercent(timelineWidth: number, relativeParentPostion: number): number {
    return Math.round((relativeParentPostion / timelineWidth) * 100)
  }

  private getCurrentTimeBasedOnCursor(videoDurationInMs: number, userCursorInPercent: number, playedDurationInMs: number): number {
    const videoDurationWithoutPlayedDuration = videoDurationInMs - playedDurationInMs
    return videoDurationWithoutPlayedDuration > 0 ? Math.round(playedDurationInMs + (videoDurationWithoutPlayedDuration / 100) * userCursorInPercent) : playedDurationInMs
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe()
  }
}
