import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core'
import { Segment } from '../../../core/models/segment'
import { ConfigurationService } from '../../../shared/services/configuration-service'
import { StudioConfiguration } from '../../../shared/services/studio-configuration'
import { Tv2VideoClipAction } from '../../../shared/models/tv2-action'
import { Subscription } from 'rxjs'
import { MediaDataService } from '../../../shared/services/media-data.service'
import { Media } from '../../../shared/services/media'
import { ActionService } from '../../../shared/abstractions/action.service'

@Component({
  selector: 'sofie-mini-shelf',
  styleUrls: ['./mini-shelf.component.scss'],
  templateUrl: './mini-shelf.component.html',
})
export class MiniShelfComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public segment: Segment
  @Input() public videoClipAction: Tv2VideoClipAction | undefined

  private readonly defaultAssetForThumbnail: string = 'assets/sofie-logo.svg'
  protected mediaDuration: number = 0
  private configurationMediaPreviewUrl: string
  private mediaDataSubscription: Subscription
  private configurationServiceSubscription: Subscription

  constructor(
    private readonly actionService: ActionService,
    private readonly configurationService: ConfigurationService,
    private readonly mediaDataService: MediaDataService
  ) {}

  public ngOnInit(): void {
    this.configurationServiceSubscription = this.configurationService.getStudioConfiguration().subscribe((configuration: StudioConfiguration) => {
      this.configurationMediaPreviewUrl = configuration.data.settings.mediaPreviewUrl
    })
    this.updateMediaDataDuration()
  }

  private updateMediaDataDuration(): void {
    if (this.segment.metadata?.miniShelfVideoClipFile !== undefined) {
      this.mediaDataSubscription = this.mediaDataService.getMedia(this.segment.metadata.miniShelfVideoClipFile).subscribe((mediaData: Media) => {
        this.mediaDuration = mediaData.duration
      })
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if ('segment' in changes) {
      this.updateMediaDataDuration()
    }
  }

  public ngOnDestroy(): void {
    this.mediaDataSubscription?.unsubscribe()
    this.configurationServiceSubscription?.unsubscribe()
  }

  protected get mediaPreviewUrl(): string {
    const url: string = `${this.configurationMediaPreviewUrl}/media/thumbnail/${this.segment.metadata?.miniShelfVideoClipFile}`
    return this.configurationMediaPreviewUrl ? url : this.defaultAssetForThumbnail
  }

  public getSanitizedTitle(): string {
    return this.segment.name
      .replace(/<[^>]*>/g, '') // remove html tags
      .replace(/(\r\n|\n|\r)/gm, ' ') // remove newlines
      .replace(/_/g, ' ') // replace underscores with spaces;
      .replace(/&nbsp;/g, ' ') // remove &nbsp;
      .replace(/\s+/g, ' ') // remove extra spaces
      .replace(/&amp;/g, '&') // remove &amp;
      .replace(/&quot;/g, '"') // remove &quot;
      .replace(/&apos;/g, "'") // remove &apos;
      .trim() // and finally trim;
  }

  protected executeAction(): void {
    if (!this.videoClipAction) {
      return
    }
    this.actionService.executeAction(this.videoClipAction.id, this.segment.rundownId).subscribe()
  }

  protected handleMissingImage(event: Event): void {
    ;(event.target as HTMLImageElement).src = this.defaultAssetForThumbnail
  }

  protected readonly NaN = NaN
  protected readonly isNaN = isNaN
}
