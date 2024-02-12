import { Component, Input } from '@angular/core'
import { Subject } from 'rxjs'
import { Tv2PieceType } from 'src/app/core/enums/tv2-piece-type'

@Component({
  selector: 'sofie-piece-hover-scrub',
  templateUrl: './piece-hover-scrub.component.html',
  styleUrls: ['./piece-hover-scrub.component.scss'],
})
export class PieceHoverScrubComponent {
  @Input() public playedDurationForPartInMs: number
  @Input() public type: Tv2PieceType
  @Input() public fileName?: string
  private readonly timeoutDurationAfterMouseMoveInMs = 5
  private timeoutAfterMouseMove?: NodeJS.Timeout
  public mouseHoverEventSubject: Subject<MouseEvent | undefined> = new Subject<MouseEvent | undefined>()
  public hoverScrubMouseEvent: MouseEvent | undefined

  public onMouseEnterInVideoTimeline(event: MouseEvent): void {
    this.emitNewHoverScrubMouseEvent(event)
  }

  public onMouseMoveInVideoTimeline(event: MouseEvent): void {
    this.emitNewHoverScrubMouseEvent(event)
  }

  public onMouseLeaveInVideoTimeline(): void {
    this.emitNewHoverScrubMouseEvent(undefined)
  }

  private emitNewHoverScrubMouseEvent(event: MouseEvent | undefined): void {
    if (this.timeoutAfterMouseMove) {
      clearTimeout(this.timeoutAfterMouseMove)
    }
    this.timeoutAfterMouseMove = setTimeout(() => {
      this.mouseHoverEventSubject.next(event)
    }, this.timeoutDurationAfterMouseMoveInMs)
  }
}
