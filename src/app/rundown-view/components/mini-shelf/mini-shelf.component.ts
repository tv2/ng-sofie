import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges } from '@angular/core'
import { Segment } from '../../../core/models/segment'
import { ConfigurationService } from '../../../shared/services/configuration.service'
import { StudioConfiguration } from '../../../shared/models/studio-configuration'
import { Tv2VideoClipAction } from '../../../shared/models/tv2-action'
import { Subscription } from 'rxjs'
import { ActionService } from '../../../shared/abstractions/action.service'
import { MediaStateService } from '../../../shared/services/media-state.service'
import { Media } from '../../../shared/services/media'
import { RundownStateService } from '../../../core/services/rundown-state.service'
import { Tv2Part } from '../../../core/models/tv2-part'

@Component({
  selector: 'sofie-mini-shelf',
  styleUrls: ['./mini-shelf.component.scss'],
  templateUrl: './mini-shelf.component.html',
})
export class MiniShelfComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public segment: Segment
  @Input() public videoClipAction?: Tv2VideoClipAction

  private actionIdForOnAirPart?: string
  private actionIdForNextPart?: string

  private readonly fallbackPreviewUrl: string = 'assets/sofie-logo.svg'
  protected media: Media | undefined
  private configurationServiceSubscription: Subscription
  private mediaSubscription?: Subscription
  private studioConfiguration?: StudioConfiguration
  protected mediaDurationInMsWithoutPostroll: number = 0

  constructor(
    private readonly actionService: ActionService,
    private readonly configurationService: ConfigurationService,
    private readonly mediaStateService: MediaStateService,
    private readonly rundownStateService: RundownStateService
  ) {}

  public ngOnInit(): void {
    this.configurationServiceSubscription = this.configurationService.getStudioConfiguration().subscribe((studioConfiguration: StudioConfiguration) => {
      this.studioConfiguration = studioConfiguration
    })
    this.updateMediaAndCalculate()

    this.rundownStateService.subscribeToOnAirPart(this.segment.rundownId).subscribe(onAirPart => {
      const onAirTv2Part: Tv2Part | undefined = onAirPart as Tv2Part | undefined
      this.actionIdForOnAirPart = onAirTv2Part?.metadata?.actionId
    })

    this.rundownStateService.subscribeToNextPart(this.segment.rundownId).subscribe(nextPart => {
      const nextTv2Part: Tv2Part | undefined = nextPart as Tv2Part | undefined
      this.actionIdForNextPart = nextTv2Part?.metadata?.actionId
    })
  }

  private updateMediaAndCalculate(): void {
    if (!this.segment.metadata?.miniShelfVideoClipFile) {
      return
    }

    this.mediaSubscription?.unsubscribe()
    this.mediaSubscription = this.mediaStateService.subscribeToMedia(this.segment.metadata?.miniShelfVideoClipFile).subscribe(media => this.updateMedia(media))
  }

  private calculateMediaDurationInMsWithoutPostroll(): void {
    if (!this.studioConfiguration) {
      return
    }

    const mediaDurationInMs: number = this.media?.duration ?? 0
    this.mediaDurationInMsWithoutPostroll = Math.max(mediaDurationInMs - this.studioConfiguration.blueprintConfiguration.ServerPostrollDuration, 0)
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const segmentChange: SimpleChange | undefined = changes['segment']
    if (segmentChange) {
      if (segmentChange.previousValue === segmentChange.currentValue) {
        return
      }

      this.updateMediaAndCalculate()
    }
  }

  public ngOnDestroy(): void {
    this.configurationServiceSubscription?.unsubscribe()
    this.mediaSubscription?.unsubscribe()
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

  private updateMedia(media: Media | undefined): void {
    this.media = media
    this.calculateMediaDurationInMsWithoutPostroll()
  }

  public get isMediaUnavailable(): boolean {
    return !!this.mediaSubscription && !this.media
  }

  protected shouldShowOnAirBorder(): boolean {
    return !!this.actionIdForOnAirPart && this.actionIdForOnAirPart === this.videoClipAction?.id
  }

  protected shouldShowNextBorder(): boolean {
    return !!this.actionIdForNextPart && this.actionIdForNextPart == this.videoClipAction?.id
  }

  public get mediaFilename(): string {
    return this.segment.metadata?.miniShelfVideoClipFile ?? ''
  }
}
