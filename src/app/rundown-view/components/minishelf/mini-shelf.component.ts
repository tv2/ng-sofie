import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core'
import { Segment } from '../../../core/models/segment'
import { ConfigurationService } from '../../../shared/services/configuration-service'
import { StudioConfiguration } from '../../../shared/models/studio-configuration'
import { Tv2VideoClipAction } from '../../../shared/models/tv2-action'
import { Subscription } from 'rxjs'
import { ActionService } from '../../../shared/abstractions/action.service'
import { MediaStateService } from '../../../shared/services/media-state.service'
import { Media } from '../../../shared/services/media'
import { Logger } from '../../../core/abstractions/logger.service'

@Component({
  selector: 'sofie-mini-shelf',
  styleUrls: ['./mini-shelf.component.scss'],
  templateUrl: './mini-shelf.component.html',
})
export class MiniShelfComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public segment: Segment
  @Input() public videoClipAction: Tv2VideoClipAction | undefined

  private readonly fallbackPreviewUrl: string = 'assets/sofie-logo.svg'
  protected media: Media
  private configurationServiceSubscription: Subscription
  private studioConfiguration: StudioConfiguration | undefined
  private readonly logger: Logger
  protected mediaDurationInMsWithoutPostroll: number = 0

  constructor(
    private readonly actionService: ActionService,
    private readonly configurationService: ConfigurationService,
    private readonly mediaStateService: MediaStateService,
    logger: Logger
  ) {
    this.logger = logger.tag('MiniShelfComponent')
  }

  public ngOnInit(): void {
    this.configurationServiceSubscription = this.configurationService.getStudioConfiguration().subscribe((studioConfiguration: StudioConfiguration) => {
      this.studioConfiguration = studioConfiguration
    })
    this.updateMediaAndCalculate()
  }

  private updateMediaAndCalculate(): void {
    if (!this.segment.metadata?.miniShelfVideoClipFile) {
      return
    }

    this.mediaStateService
      .subscribeToMedia(this.segment.metadata?.miniShelfVideoClipFile)
      .then(mediaObservable =>
        mediaObservable.subscribe(media => {
          this.setMedia(media)
          this.calculateMediaDurationInMsWithoutPostroll()
        })
      )
      .catch(error => this.logger.data(error).error(`Failed to update media for segment '${this.segment.name}' with id '${this.segment.id}'.`))
  }

  private calculateMediaDurationInMsWithoutPostroll(): void {
    if (!this.segment.metadata?.miniShelfVideoClipFile) {
      return
    }
    if (!this.studioConfiguration) {
      return
    }

    this.mediaDurationInMsWithoutPostroll = Math.max(this.media.duration - this.studioConfiguration.blueprintConfiguration.ServerPostrollDuration, 0)
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if ('segment' in changes) {
      this.updateMediaAndCalculate()
    }
  }

  public ngOnDestroy(): void {
    this.configurationServiceSubscription?.unsubscribe()
  }

  protected get mediaPreviewUrl(): string {
    if (!this.studioConfiguration?.settings.mediaPreviewUrl) {
      return this.fallbackPreviewUrl
    }
    return `${this.studioConfiguration.settings.mediaPreviewUrl}/media/thumbnail/${this.segment.metadata?.miniShelfVideoClipFile}`
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
    ;(event.target as HTMLImageElement).src = this.fallbackPreviewUrl
  }

  private setMedia(media: Media): void {
    this.media = media
  }
}
