import { Component, Input } from '@angular/core'
import { Subject } from 'rxjs'
import { Tv2PieceType } from 'src/app/core/enums/tv2-piece-type'
import { PieceLifespan } from 'src/app/core/models/piece-lifespan'

@Component({
  selector: 'sofie-piece-hover-scrub',
  templateUrl: './piece-hover-scrub.component.html',
  styleUrls: ['./piece-hover-scrub.component.scss'],
})
export class PieceHoverScrubComponent {
  @Input() public playedDurationForPartInMs: number
  @Input() public type: Tv2PieceType
  @Input() public isMediaUnavailable: boolean
  @Input() public pieceLifespan: PieceLifespan
  @Input() public fileName: string

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
