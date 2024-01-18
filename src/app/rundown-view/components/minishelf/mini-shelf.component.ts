import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { Segment } from '../../../core/models/segment'
import { ConfigurationService } from '../../../shared/services/configuration-service'
import { StudioConfiguration } from '../../../shared/services/studio-configuration'
import { Tv2Action, Tv2VideoClipAction } from '../../../shared/models/tv2-action'

import { Subscription } from 'rxjs'
import { MediaDataService } from '../../../shared/services/media-data.service'
import { MediaData } from '../../../shared/services/media-data'

@Component({
  selector: 'sofie-mini-shelf',
  styleUrls: ['./mini-shelf.component.scss'],
  templateUrl: './mini-shelf.component.html',
})
export class MiniShelfComponent implements OnInit, OnDestroy {
  @Input() public segment: Segment
  @Input() public videoClipAction: Tv2VideoClipAction | undefined

  @Output()
  public executeActionEmitter: EventEmitter<Tv2Action> = new EventEmitter()

  protected mediaDuration: number = 0
  private configurationMediaPreviewUrl: string
  private mediaDataSubscription: Subscription

  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly mediaDataService: MediaDataService
  ) {
    void this.configurationService.getStudioConfiguration().subscribe((configuration: StudioConfiguration) => {
      this.configurationMediaPreviewUrl = configuration.data.settings.mediaPreviewUrl
    })
  }

  public ngOnInit(): void {
    if (this.segment.metadata?.miniShelfVideoClipFile !== undefined) {
      this.mediaDataSubscription = this.mediaDataService.getMediaDurationById(this.segment.metadata.miniShelfVideoClipFile).subscribe((mediaData: MediaData) => {
        this.mediaDuration = mediaData.duration
      })
    }
  }
  public ngOnDestroy(): void {
    this.mediaDataSubscription?.unsubscribe()
  }

  protected get mediaPreviewUrl(): string {
    const url: string = `${this.configurationMediaPreviewUrl}/media/thumbnail/${this.segment.metadata?.miniShelfVideoClipFile}`
    return this.configurationMediaPreviewUrl ? url : 'assets/sofie-logo.svg'
  }

  public getSanitizedTitle(): string {
    let sanitizedTitle = this.segment.name?.replace(/<[^>]*>/g, '') // remove html tags
    sanitizedTitle = sanitizedTitle?.replace(/(\r\n|\n|\r)/gm, ' ') // remove newlines
    sanitizedTitle = sanitizedTitle?.replace(/_/g, ' ') // replace underscores with spaces;
    sanitizedTitle = sanitizedTitle?.replace(/&nbsp;/g, ' ') // remove &nbsp;
    sanitizedTitle = sanitizedTitle?.replace(/\s+/g, ' ') // remove extra spaces
    sanitizedTitle = sanitizedTitle?.replace(/&amp;/g, '&') // remove &amp;
    sanitizedTitle = sanitizedTitle?.replace(/&quot;/g, '"') // remove &quot;
    sanitizedTitle = sanitizedTitle?.replace(/&apos;/g, "'") // remove &apos;
    sanitizedTitle = sanitizedTitle?.trim() // and finally trim;
    return sanitizedTitle
  }

  protected executeAction(): void {
    if (!this.videoClipAction) {
      return
    }
    const action: Tv2Action = this.videoClipAction
    this.executeActionEmitter.emit(action)
  }

  protected handleMissingImage(event: Event): void {
    ;(event.target as HTMLImageElement).src = 'assets/sofie-logo.svg'
  }
}
