import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

@Component({
  selector: 'sofie-mini-shelf',
  styleUrls: ['./mini-shelf.component.scss'],
  templateUrl: './mini-shelf.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush, // needed to stop re-rendering of the component on every tick
})
export class MiniShelfComponent {
  @Input() protected shelves: ShelfFromSOF1721[]

  constructor() {
    this.shelves = this.shelves ? this.shelves : ShelfFromSOF1721.getShelves()
  }

  protected handleMissingImage(event: Event): void {
    ;(event.target as HTMLImageElement).src = 'favicon.ico'
  }
}

// TODO: update this class once SOF-1721 is solved
class ShelfFromSOF1721 {
  protected readonly id: number
  protected readonly thumbnailUrl: string
  protected readonly duration: number
  protected readonly title: string

  constructor(id: number, url: string, title: string, duration?: number) {
    this.id = id
    this.thumbnailUrl = url
    this.title = title.toUpperCase()
    this.duration = duration || ~~(Math.random() * 1000)
  }

  public getThumbnailUrl(): string {
    return this.thumbnailUrl
  }
  public getFormattedDuration(): string {
    const date = new Date()
    date.setSeconds(this.duration)
    return `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}:${
      date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
    }:${date.getMilliseconds() < 10 ? `00${date.getMilliseconds()}` : date.getMilliseconds() < 100 ? `0${date.getMilliseconds()}` : date.getMilliseconds()}`
  }
  public getFormattedTitle(): string {
    return this.title
  }
  public getId(): number {
    return this.id
  }

  // TODO: remove this and use real data once SOF-1721 is solved
  public static getShelves(): ShelfFromSOF1721[] {
    let counter: number = -1 + Math.random() * 5
    let shelves: ShelfFromSOF1721[] = []
    while (counter-- > 0) {
      const randomNum: number = ~~(Math.random() * (999 - 100 + 1) + 100)
      const shelf: ShelfFromSOF1721 = new ShelfFromSOF1721(randomNum, `https://picsum.photos/id/${randomNum}/270/100`, `Title ${randomNum}`, ~~(Math.random() * 60 * 60 * 30))
      shelves.push(shelf)
    }
    return shelves
  }
}
