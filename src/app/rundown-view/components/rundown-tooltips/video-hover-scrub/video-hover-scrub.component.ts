import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core'
import { Subject, takeUntil } from 'rxjs'
import { ConfigurationService } from 'src/app/shared/services/configuration.service'
import { StudioConfiguration } from 'src/app/shared/models/studio-configuration'
import { Icon, IconSize } from 'src/app/shared/enums/icon'

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

  @ViewChild('videoElementRef')
  public videoElementRef: ElementRef<HTMLVideoElement>

  private readonly unsubscribe$: Subject<void> = new Subject()

  protected readonly Icon = Icon
  protected readonly IconSize = IconSize

  public previewUrl: string = ''

  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.configurationService
      .getStudioConfiguration()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((studioConfiguration: StudioConfiguration) => this.setVideoPreviewUrl(studioConfiguration))
  }

  private setVideoPreviewUrl(studioConfiguration: StudioConfiguration): void {
    const baseMediaUrl: string = `${studioConfiguration.settings.mediaPreviewUrl}/media/preview/`
    this.previewUrl = this.isJingle ? `${baseMediaUrl}${studioConfiguration.blueprintConfiguration.JingleFolder}/${this.filename}` : `${baseMediaUrl}${this.filename}`
    this.changeDetectorRef.detectChanges()
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

    this.currentVideoTimeInMs = this.getCurrentTimeInVideo()
    this.videoElementRef.nativeElement.currentTime = this.currentVideoTimeInMs / 1000
  }

  private getCurrentTimeInVideo(): number {
    const playedDurationInMs: number = this.playedDurationInMs ?? 0
    const videoDurationWithoutPlayedDuration: number = this.durationInMs - playedDurationInMs
    return videoDurationWithoutPlayedDuration > 0 ? Math.round(playedDurationInMs + (videoDurationWithoutPlayedDuration / 100) * this.getPositionInVideoInPercent()) : playedDurationInMs
  }

  private getPositionInVideoInPercent(): number {
    return Math.round((this.positionInVideoInPixels / this.videoLengthInPixels) * 100)
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe()
  }
}
