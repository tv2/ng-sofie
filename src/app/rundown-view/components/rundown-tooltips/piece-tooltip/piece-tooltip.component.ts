import { ChangeDetectorRef, Component, HostListener, Input } from '@angular/core'
import { Tv2PieceType } from 'src/app/core/enums/tv2-piece-type'
import { Piece } from 'src/app/core/models/piece'
import { TooltipMousePosition } from 'src/app/core/models/tooltips'
import { Tv2Piece } from 'src/app/core/models/tv2-piece'

@Component({
  selector: 'sofie-piece-tooltip',
  templateUrl: './piece-tooltip.component.html',
  styleUrls: ['./piece-tooltip.component.scss'],
})
export class PieceTooltipComponent {
  @Input() public playedDurationForPartInMs?: number
  @Input() public isMediaUnavailable?: boolean
  @Input() public piece: Piece
  @Input() public durationInMs: number

  public tooltipElementHoverMousePosition?: TooltipMousePosition
  public Tv2PieceType = Tv2PieceType

  private readonly timeoutDurationAfterMouseMoveInMs = 5
  private timeoutAfterMouseMove?: NodeJS.Timeout
  private readonly visibleOnTypes: Tv2PieceType[] = [Tv2PieceType.VIDEO_CLIP, Tv2PieceType.JINGLE, Tv2PieceType.REPLAY]
  private readonly videoHoverScrubTypes: Tv2PieceType[] = [Tv2PieceType.VIDEO_CLIP, Tv2PieceType.JINGLE]

  @HostListener('mouseenter', ['$event'])
  @HostListener('mousemove', ['$event'])
  @HostListener('mouseleave', [])
  public emitNewHoverMouseEvent(event?: MouseEvent): void {
    if (this.timeoutAfterMouseMove) {
      clearTimeout(this.timeoutAfterMouseMove)
    }
    this.timeoutAfterMouseMove = setTimeout(() => {
      this.tooltipElementHoverMousePosition = event
        ? {
            mousePositionX: event.clientX,
            mousePositionY: event.clientY,
            parrentElementOffsetY: event.offsetY,
            parrentElementOffsetX: event.offsetX,
          }
        : undefined
      this.changeDetectorRef.detectChanges()
    }, this.timeoutDurationAfterMouseMoveInMs)
  }

  public get tv2PieceType(): Tv2PieceType {
    const piece: Tv2Piece = this.piece as Tv2Piece
    return piece.metadata.type
  }

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  public get shouldShowHoverScrub(): boolean {
    const tv2Piece: Tv2Piece = this.piece as Tv2Piece
    return this.visibleOnTypes.indexOf(tv2Piece.metadata?.type) !== -1
  }

  protected withVideoHoverScrub(): boolean {
    const tv2Piece: Tv2Piece = this.piece as Tv2Piece
    return this.videoHoverScrubTypes.indexOf(tv2Piece.metadata?.type) !== -1
  }
}
