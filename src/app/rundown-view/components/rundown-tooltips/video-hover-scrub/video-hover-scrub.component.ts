import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core'
import { Subject, takeUntil } from 'rxjs'
import { ConfigurationService } from 'src/app/shared/services/configuration.service'
import { StudioConfiguration } from 'src/app/shared/models/studio-configuration'
import { IconButton, IconButtonSize } from 'src/app/shared/enums/icon-button'

@Component({
  selector: 'sofie-video-hover-scrub',
  templateUrl: './video-hover-scrub.component.html',
  styleUrls: ['./video-hover-scrub.component.scss'],
})
export class VideoHoverScrubComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public filename: string
  @Input() public videoLengthInPixels: number
  @Input() public positionInVideoInPixels: number
  @Input() public playedDurationInMs?: number
  @Input() public durationInMs: number
  @Input() public isJingle?: boolean

  public currentVideoTimeInMs: number
  public isVideoVisible: boolean

  @ViewChild('videoElementRef')
  public videoElementRef: ElementRef<HTMLVideoElement>

  private studioConfiguration: StudioConfiguration
  private readonly unsubscribe$: Subject<void> = new Subject()

  protected readonly IconButton = IconButton
  protected readonly IconButtonSize = IconButtonSize

  constructor(private readonly configurationService: ConfigurationService) {}

  public ngOnInit(): void {
    this.configurationService
      .getStudioConfiguration()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((studioConfiguration: StudioConfiguration) => {
        this.studioConfiguration = studioConfiguration
      })
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!changes['positionInVideoInPixels']) {
      return
    }
    this.setNewTimeForVideoElement()
  }

  private setNewTimeForVideoElement(): void {
    if (!this.videoElementRef?.nativeElement) {
      return
    }
    if (this.positionInVideoInPixels === 0) {
      return
    }

    this.isVideoVisible = true
    this.currentVideoTimeInMs = this.getCurrentTimeInVideo()
    this.videoElementRef.nativeElement.currentTime = this.currentVideoTimeInMs / 1000
  }

  private getCurrentTimeInVideo(): number {
    const playedDurationInMs: number = this.playedDurationInMs ? this.playedDurationInMs : 0
    const videoDurationWithoutPlayedDuration: number = this.durationInMs - playedDurationInMs
    return videoDurationWithoutPlayedDuration > 0 ? Math.round(playedDurationInMs + (videoDurationWithoutPlayedDuration / 100) * this.getPositionInVideoInPercent()) : playedDurationInMs
  }

  private getPositionInVideoInPercent(): number {
    return Math.round((this.positionInVideoInPixels / this.videoLengthInPixels) * 100)
  }

  public getVideoPreviewUrl(): string {
    if (!this.isVideoVisible || !this.studioConfiguration) {
      return ''
    }
    const baseMediaUrl: string = `${this.studioConfiguration.settings.mediaPreviewUrl}/media/preview/`
    return this.isJingle ? `${baseMediaUrl}${this.studioConfiguration.blueprintConfiguration.JingleFolder}/${this.filename}` : `${baseMediaUrl}${this.filename}`
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe()
  }
}
