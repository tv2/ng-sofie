import { Component, Input } from '@angular/core'
import { Segment } from '../../../core/models/segment'

@Component({
  selector: 'sofie-mini-shelf',
  styleUrls: ['./mini-shelf.component.scss'],
  templateUrl: './mini-shelf.component.html',
})
export class MiniShelfComponent {
  @Input()
  public segment: Segment
  @Input()
  protected shelves: ShelfFromSOF1721[]

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

  constructor(id: number, url: string, duration?: number) {
    this.id = id
    this.thumbnailUrl = url
    this.duration = duration || ~~(Math.random() * 1000)
  }

  public getThumbnailUrl(): string {
    return this.thumbnailUrl
  }
  public getFormattedDuration(): number {
    return this.duration.valueOf()
  }
  public getId(): number {
    return this.id
  }

  // TODO: remove this and use real data once SOF-1721 is solved
  public static getShelves(): ShelfFromSOF1721[] {
    let counter: number = Math.random() * 5
    let shelves: ShelfFromSOF1721[] = []
    while (counter > 0) {
      const randomNum: number = ~~(Math.random() * (999 - 100 + 1) + 100)
      const shelf = new ShelfFromSOF1721(randomNum, `https://picsum.photos/id/${randomNum}/270/100`)
      shelves.push(shelf)
      counter--
    }
    return shelves
  }
}
