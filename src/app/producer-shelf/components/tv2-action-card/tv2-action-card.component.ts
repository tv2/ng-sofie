import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostBinding, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Tv2Action, Tv2ActionContentType, Tv2VideoClipAction } from '../../../shared/models/tv2-action'
import { ConfigurationService } from '../../../shared/services/configuration.service'
import { StudioConfiguration } from '../../../shared/models/studio-configuration'
import { TooltipMetadata } from '../../../shared/directives/tooltip.directive'
import { Media } from '../../../shared/services/media'
import { MediaStateService } from '../../../shared/services/media-state.service'
import { Subject, takeUntil } from 'rxjs'

const ASPECT_RATIO: number = 16 / 9
const THUMBNAIL_URL_PART: string = '/media/thumbnail/'

@Component({
  selector: 'sofie-tv2-action-card',
  templateUrl: './tv2-action-card.component.html',
  styleUrls: ['./tv2-action-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tv2ActionCardComponent implements OnInit, OnDestroy {
  @Input()
  public action: Tv2Action

  @ViewChild('title')
  public titleRef: ElementRef

  public videoClipThumbnailUrl: string = ''
  public positionInVideoInMs: number = 0

  private media?: Media
  private studioConfiguration?: StudioConfiguration

  private readonly unsubscribeSubject: Subject<void> = new Subject()

  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly elementRef: ElementRef,
    private readonly mediateStateService: MediaStateService
  ) {}

  public ngOnInit(): void {
    if (this.isVideoClipAction()) {
      this.configurationService
        .getStudioConfiguration()
        .pipe(takeUntil(this.unsubscribeSubject))
        .subscribe(studioConfiguration => {
          this.studioConfiguration = studioConfiguration
          this.updateVideoClipThumbnailUrl()
        })

      this.subscribeToMedia()
    }
  }

  private updateVideoClipThumbnailUrl(): void {
    if (!this.isVideoClipAction() || !this.studioConfiguration || !this.studioConfiguration.settings.mediaPreviewUrl) {
      return
    }

    const videoClipAction: Tv2VideoClipAction = this.action as Tv2VideoClipAction
    this.videoClipThumbnailUrl = `${this.studioConfiguration.settings.mediaPreviewUrl}${THUMBNAIL_URL_PART}${videoClipAction.metadata.fileName}`
    this.changeDetectorRef.detectChanges()
  }

  private subscribeToMedia(): void {
    if (!this.isVideoClipAction()) {
      return
    }
    const videoClipAction: Tv2VideoClipAction = this.action as Tv2VideoClipAction
    this.mediateStateService
      .subscribeToMedia(videoClipAction.metadata.fileName)
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe(media => {
        this.media = media
      })
  }

  public getThumbnailHeight(): number {
    return this.elementRef.nativeElement.offsetHeight - this.titleRef.nativeElement.offsetHeight
  }

  public getThumbnailWidth(): number {
    return this.getThumbnailHeight() * ASPECT_RATIO
  }

  @HostBinding('class')
  public get getPieceTypeModifierClass(): string {
    return this.getActionContentType()
  }

  @HostBinding('class.missing-source')
  public get isMediaMissing(): boolean {
    return this.isVideoClipAction() && !this.media
  }

  private getActionContentType(): string {
    return this.action.metadata.contentType.toLowerCase().replace('_', '-')
  }

  public isVideoClipAction(): boolean {
    return this.action.metadata.contentType === Tv2ActionContentType.VIDEO_CLIP
  }

  public getVideoClipFilename(): string {
    if (!this.isVideoClipAction()) {
      return ''
    }
    const videoClipAction: Tv2VideoClipAction = this.action as Tv2VideoClipAction
    return videoClipAction.metadata.fileName
  }

  public updatePositionInVideo(tooltipMetadata: TooltipMetadata): void {
    const videoLengthInPixels: number = this.elementRef.nativeElement.offsetWidth
    const positionInVideoInPercent: number = tooltipMetadata.horizontalOffsetInPixels / videoLengthInPixels
    this.positionInVideoInMs = Math.round((this.media?.duration ?? 0) * positionInVideoInPercent)
  }

  public ngOnDestroy(): void {
    this.unsubscribeSubject.next()
    this.unsubscribeSubject.complete()
  }
}
