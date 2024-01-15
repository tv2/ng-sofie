import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

export class MiniShelfMetadata {
  public duration: number
  public thumbnail: string
  public videoClipFile: string
}

@Component({
  selector: 'sofie-mini-shelf',
  styleUrls: ['./mini-shelf.component.scss'],
  templateUrl: './mini-shelf.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush, // needed to stop re-rendering of the component on every tick
})
export class MiniShelfComponent {
  @Input()
  public metadata!: MiniShelfMetadata | undefined
  @Input()
  public title: string

  // expected from segment.metadata
  // { miniShelfData: {
  //    videoClipFile: string,
  //    duration: number,
  //    thumbnail: string
  //    } }
  defaultImage: string

  constructor() {
    this.defaultImage = `https://picsum.photos/id/${~~(Math.random() * (999 - 100 + 1) + 100)}/270/100`
  }

  public getFormattedTitle(): string {
    return this.title?.length > 25 ? this.title?.toUpperCase().trim().substring(0, 25) + '...' : this.title?.toUpperCase().trim()
  }

  protected handleClick(): void {
    // TODO - should find the correct action here
    // <string>this.metadata?.videoClipFile
  }

  public getFormattedDuration(): string {
    const date = new Date()
    date.setSeconds(this.metadata?.duration?.valueOf() || 0)

    // TODO - miliseconds are not needed BUT show refresh problem that needs to be addressed
    return `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}:${
      date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
    }:${date.getMilliseconds() < 10 ? `00${date.getMilliseconds()}` : date.getMilliseconds() < 100 ? `0${date.getMilliseconds()}` : date.getMilliseconds()}`
  }

  protected handleMissingImage(event: Event): void {
    ;(event.target as HTMLImageElement).src = 'favicon.ico'
  }
}
