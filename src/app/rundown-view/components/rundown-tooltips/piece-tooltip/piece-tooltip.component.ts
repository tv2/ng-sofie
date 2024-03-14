import { ChangeDetectorRef, Component, HostListener, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core'
import { Tv2PieceType } from 'src/app/core/enums/tv2-piece-type'
import { Piece } from 'src/app/core/models/piece'
import { TooltipMousePosition } from 'src/app/core/models/tooltips'
import { Tv2Piece } from 'src/app/core/models/tv2-piece'
import { IconButton, IconButtonSize } from '../../../../shared/enums/icon-button'
import { TooltipContentField } from '../../../../shared/abstractions/tooltip-content-field'
import { Tv2PieceTooltipContentFieldService } from '../../../services/tv2-piece-tooltip-content-field.service'
import { Media } from '../../../../shared/services/media'

@Component({
  selector: 'sofie-piece-tooltip',
  templateUrl: './piece-tooltip.component.html',
  styleUrls: ['./piece-tooltip.component.scss'],
})
export class PieceTooltipComponent implements OnChanges {
  @Input() public playedDurationForPartInMs?: number
  @Input() public isMediaUnavailable?: boolean
  @Input() public piece: Piece
  @Input() public durationInMs: number
  @Input() public media: Media | undefined

  public tooltipElementHoverMousePosition?: TooltipMousePosition
  public tooltipContentFields: TooltipContentField[]
  public Tv2PieceType = Tv2PieceType
  public isTooltipCompatible: boolean

  protected readonly IconButtonSize = IconButtonSize
  protected readonly IconButton = IconButton
  protected readonly sourceUnavailableLabel: string = $localize`piece-tooltip.source-unavailable.label`

  private readonly timeoutDurationAfterMouseMoveInMs = 5
  private timeoutAfterMouseMove?: NodeJS.Timeout

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

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly tv2PieceTooltipContentFieldService: Tv2PieceTooltipContentFieldService
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    const pieceChange: SimpleChange | undefined = changes['piece']
    if (pieceChange) {
      this.setIsTooltipCompatible()
      this.setPieceTooltipContent()
    }
  }

  public setPieceTooltipContent(): void {
    this.tooltipContentFields = this.tv2PieceTooltipContentFieldService.getTooltipContentForPiece(this.piece, this.media, this.durationInMs)
  }

  public setIsTooltipCompatible(): void {
    const tv2Piece: Tv2Piece = this.piece as Tv2Piece
    const tooltipPieceTypes: Tv2PieceType[] = [Tv2PieceType.VIDEO_CLIP, Tv2PieceType.JINGLE, Tv2PieceType.GRAPHICS, Tv2PieceType.OVERLAY_GRAPHICS, Tv2PieceType.AUDIO, Tv2PieceType.VOICE_OVER]
    this.isTooltipCompatible = tooltipPieceTypes.includes(tv2Piece.metadata.type)
  }

  public get shouldShowHoverScrub(): boolean {
    const tv2Piece: Tv2Piece = this.piece as Tv2Piece
    return (tv2Piece.metadata?.type === Tv2PieceType.VIDEO_CLIP || tv2Piece.metadata?.type === Tv2PieceType.JINGLE) && tv2Piece.metadata.sourceName !== undefined
  }

  public getPieceType(): Tv2PieceType {
    const tv2Piece: Tv2Piece = this.piece as Tv2Piece
    return tv2Piece.metadata.type
  }
}
