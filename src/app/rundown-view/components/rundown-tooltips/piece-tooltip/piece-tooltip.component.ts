import { Component, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core'
import { Tv2PieceType } from 'src/app/core/enums/tv2-piece-type'
import { Piece } from 'src/app/core/models/piece'
import { Tv2Piece } from 'src/app/core/models/tv2-piece'
import { TooltipContentField } from '../../../../shared/abstractions/tooltip-content-field'
import { Tv2PieceTooltipContentFieldService } from '../../../services/tv2-piece-tooltip-content-field.service'
import { Media } from '../../../../shared/services/media'
import { Icon, IconSize } from '../../../../shared/enums/icon'
import { TooltipMetadata } from '../../../../shared/directives/tooltip.directive'

@Component({
  selector: 'sofie-piece-tooltip',
  templateUrl: './piece-tooltip.component.html',
  styleUrls: ['./piece-tooltip.component.scss'],
})
export class PieceTooltipComponent implements OnChanges {
  protected readonly Icon = Icon
  protected readonly IconSize = IconSize

  @Input() public playedDurationForPartInMs?: number
  @Input() public isMediaUnavailable?: boolean
  @Input() public piece: Piece
  @Input() public durationInMs: number
  @Input() public media?: Media
  @Input() public tooltipMetadata?: TooltipMetadata

  public tooltipContentFields: TooltipContentField[]
  public Tv2PieceType = Tv2PieceType
  public shouldShowHoverScrub: boolean

  constructor(private readonly tv2PieceTooltipContentFieldService: Tv2PieceTooltipContentFieldService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    const pieceChange: SimpleChange | undefined = changes['piece']
    const mediaChange: SimpleChange | undefined = changes['media']
    if (pieceChange || mediaChange) {
      this.updateTooltipContent()
      this.updateShouldShowHoverScrub()
    }
  }

  public get tv2PieceType(): Tv2PieceType {
    const piece: Tv2Piece = this.piece as Tv2Piece
    return piece.metadata.type
  }

  public updateTooltipContent(): void {
    this.tooltipContentFields = this.tv2PieceTooltipContentFieldService.getTooltipContentForPiece(this.piece, this.media, this.durationInMs)
  }

  public updateShouldShowHoverScrub(): void {
    const tv2Piece: Tv2Piece = this.piece as Tv2Piece
    this.shouldShowHoverScrub = (tv2Piece.metadata?.type === Tv2PieceType.VIDEO_CLIP || tv2Piece.metadata?.type === Tv2PieceType.JINGLE) && tv2Piece.metadata.sourceName !== undefined
  }

  public getPieceType(): Tv2PieceType {
    const tv2Piece: Tv2Piece = this.piece as Tv2Piece
    return tv2Piece.metadata.type
  }
}
