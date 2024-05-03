import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostBinding, Input, OnInit, ViewChild } from '@angular/core'
import { Tv2Action, Tv2ActionContentType, Tv2VideoClipAction } from '../../../shared/models/tv2-action'
import { ConfigurationService } from '../../../shared/services/configuration.service'
import { StudioConfiguration } from '../../../shared/models/studio-configuration'

const ASPECT_RATIO: number = 16 / 9
const THUMBNAIL_URL_PART: string = '/media/thumbnail/'

@Component({
  selector: 'sofie-tv2-action-card',
  templateUrl: './tv2-action-card.component.html',
  styleUrls: ['./tv2-action-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tv2ActionCardComponent implements OnInit {
  @Input()
  public action: Tv2Action

  @ViewChild('title')
  public titleRef: ElementRef

  public videoClipThumbnailUrl: string = ''
  private studioConfiguration?: StudioConfiguration

  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly elementRef: ElementRef
  ) {}

  public ngOnInit(): void {
    if (this.isVideoClipAction()) {
      this.configurationService.getStudioConfiguration().subscribe(studioConfiguration => {
        this.studioConfiguration = studioConfiguration
        this.updateVideoClipThumbnailUrl()
      })
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

  private getActionContentType(): string {
    return this.action.metadata.contentType.toLowerCase().replace('_', '-')
  }

  public isVideoClipAction(): boolean {
    return this.action.metadata.contentType === Tv2ActionContentType.VIDEO_CLIP
  }
}
