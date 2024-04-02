import { Component, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core'
import { Tv2PieceType } from 'src/app/core/enums/tv2-piece-type'
import { Piece } from 'src/app/core/models/piece'
import { Tv2Piece } from 'src/app/core/models/tv2-piece'
import { TooltipContentField } from '../../../../shared/abstractions/tooltip-content-field'
import { Tv2PieceTooltipContentFieldService } from '../../../services/tv2-piece-tooltip-content-field.service'
import { Media } from '../../../../shared/services/media'
import { Icon, IconSize } from '../../../../shared/enums/icon'

@Component({
  selector: 'sofie-piece-tooltip',
  templateUrl: './piece-tooltip.component.html',
  styleUrls: ['./piece-tooltip.component.scss'],
})
export class PieceTooltipComponent implements OnChanges {
  protected readonly Icon = Icon
  protected readonly IconSize = IconSize

  @Input() public piece: Piece
  @Input() public media?: Media
  @Input() public durationInMs: number
  @Input() public positionInVideoInMs: number = 0

  public tooltipContentFields: TooltipContentField[]
  public shouldShowHoverScrub: boolean = false

  constructor(private readonly tv2PieceTooltipContentFieldService: Tv2PieceTooltipContentFieldService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    const pieceChange: SimpleChange | undefined = changes['piece']
    const mediaChange: SimpleChange | undefined = changes['media']
    if (pieceChange || mediaChange) {
      this.updateTooltipContent()
      this.updateShouldShowHoverScrub()
    }
  }

  public updateTooltipContent(): void {
    this.tooltipContentFields = this.tv2PieceTooltipContentFieldService.getTooltipContentForPiece(this.piece, this.media, this.durationInMs)
  }

  public updateShouldShowHoverScrub(): void {
    const tv2Piece: Tv2Piece = this.piece as Tv2Piece
    this.shouldShowHoverScrub = this.hasPieceMedia() && [Tv2PieceType.VIDEO_CLIP, Tv2PieceType.JINGLE].includes(tv2Piece.metadata.type)
  }

  public hasPieceMedia(): boolean {
    const tv2Piece: Tv2Piece = this.piece as Tv2Piece
    return tv2Piece.metadata.sourceName !== undefined
  }

  public getPieceColorClass(): string {
    const tv2Piece: Tv2Piece = this.piece as Tv2Piece
    return tv2Piece.metadata.type.toLocaleLowerCase().replace('_', '-') + '-color'
  }
}
