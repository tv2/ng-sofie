import { Component, Input } from '@angular/core'
import { Subject } from 'rxjs'
import { Tv2PieceType } from 'src/app/core/enums/tv2-piece-type'

@Component({
  selector: 'sofie-mini-shelf-tooltip',
  templateUrl: './mini-shelf-tooltip.component.html',
  styleUrls: ['./mini-shelf-tooltip.component.scss'],
})
export class MiniShelfTooltipComponent {
  @Input() public fileName: string

  public readonly type: Tv2PieceType = Tv2PieceType.VIDEO_CLIP
  public mouseHoverEventSubject: Subject<MouseEvent | undefined> = new Subject<MouseEvent | undefined>()
  public hoverScrubMouseEvent: MouseEvent | undefined

  private readonly timeoutDurationAfterMouseMoveInMs = 5
  private timeoutAfterMouseMove?: NodeJS.Timeout

  public emitNewHoverMouseEvent(event?: MouseEvent): void {
    if (this.timeoutAfterMouseMove) {
      clearTimeout(this.timeoutAfterMouseMove)
    }
    this.timeoutAfterMouseMove = setTimeout(() => {
      this.mouseHoverEventSubject.next(event)
    }, this.timeoutDurationAfterMouseMoveInMs)
  }
}
