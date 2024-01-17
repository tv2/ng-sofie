import { Component, Input } from '@angular/core'
import { Segment } from '../../../core/models/segment'
import { ConfigurationService } from '../../../shared/services/configuration-service'
import { StudioConfiguration } from '../../../shared/services/studio-configuration'
import { ActionStateService } from '../../../shared/services/action-state.service'
import { Tv2Action, Tv2VideoClipAction } from '../../../shared/models/tv2-action'

@Component({
  selector: 'sofie-mini-shelf',
  styleUrls: ['./mini-shelf.component.scss'],
  templateUrl: './mini-shelf.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush, // needed to stop re-rendering of the component on every tick
})
export class MiniShelfComponent {
  @Input() public segment: Segment
  @Input() public videoClipAction: Tv2VideoClipAction | undefined

  protected readonly mediaDuration: number
  protected get mediaPreviewUrl(): string {
    const url: string = `${this.configurationMediaPreviewUrl}/media/thumbnail/${this.segment.metadata?.miniShelfVideoClipFile}`
    return this.configurationMediaPreviewUrl ? url : 'assets/sofie-logo.svg'
  }
  private configurationMediaPreviewUrl: string

  constructor(private readonly configurationService: ConfigurationService) {
    void this.configurationService.getStudioConfiguration().subscribe((configuration: StudioConfiguration) => {
      this.configurationMediaPreviewUrl = configuration.data.settings.mediaPreviewUrl
    })
    // let thumbnailU
    this.mediaDuration = 100 * ~~(Math.random() * (999 - 100 + 1) + 100)
  }

  public getFormattedTitle(): string {
    let sanitizedTitle = this.segment.name?.replace(/<[^>]*>/g, '') // remove html tags
    sanitizedTitle = sanitizedTitle?.replace(/(\r\n|\n|\r)/gm, ' ') // remove newlines
    sanitizedTitle = sanitizedTitle?.replace(/_/g, ' ') // replace underscores with spaces;
    sanitizedTitle = sanitizedTitle?.replace(/&nbsp;/g, ' ') // remove &nbsp;
    sanitizedTitle = sanitizedTitle?.replace(/\s+/g, ' ') // remove extra spaces
    sanitizedTitle = sanitizedTitle?.replace(/&amp;/g, '&') // remove &amp;
    sanitizedTitle = sanitizedTitle?.replace(/&quot;/g, '"') // remove &quot;
    sanitizedTitle = sanitizedTitle?.replace(/&apos;/g, "'") // remove &apos;
    sanitizedTitle = sanitizedTitle?.trim().toUpperCase() // trim and uppercase
    return sanitizedTitle
  }

  protected handleClick(): void {
    // TODO - should find the correct action here
    alert(`ckicked ${this.videoClipAction?.name}`)
  }

  protected handleMissingImage(event: Event): void {
    ;(event.target as HTMLImageElement).src = 'assets/sofie-logo.svg'
  }
}
