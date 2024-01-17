import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { Segment } from '../../../core/models/segment'
import { ConfigurationService } from '../../../shared/services/configuration-service'
import { StudioConfiguration } from '../../../shared/services/studio-configuration'

@Component({
  selector: 'sofie-mini-shelf',
  styleUrls: ['./mini-shelf.component.scss'],
  templateUrl: './mini-shelf.component.html',
  providers: [ConfigurationService],
  changeDetection: ChangeDetectionStrategy.OnPush, // needed to stop re-rendering of the component on every tick
})
export class MiniShelfComponent {

  @Input() public segment: Segment

  private readonly mediaDuration: number
  protected mediaPreviewUrl: string
  constructor(private readonly configurationService: ConfigurationService) {
    this.mediaPreviewUrl = `https://picsum.photos/id/${~~(Math.random() * (999 - 100 + 1) + 100)}/270/100`

    void this.configurationService.getStudioConfiguration().then((configuration: StudioConfiguration) => {
      this.mediaPreviewUrl = `${configuration.data.settings.mediaPreviewUrl}/media/thumbnail/${this.segment.metadata?.miniShelfVideoClipFile}`
    })
    // let thumbnailU
    this.mediaDuration = ~~(Math.random() * (999 - 100 + 1) + 100)
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
    alert(`ckicked `)
    // <string>this.metadata?.videoClipFile
  }

  public getFormattedDuration(): string {
    const date: Date = new Date()
    date.setSeconds(this.mediaDuration.valueOf() || 0)

    return `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}:${
      date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
    }`
  }

  protected handleMissingImage(event: Event): void {
    ;(event.target as HTMLImageElement).src = 'assets/sofie-logo.svg'
  }
}
