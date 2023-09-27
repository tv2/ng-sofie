import { ChangeDetectionStrategy, Component, HostBinding, Input, OnChanges } from '@angular/core'
import { PartEntityService } from '../../../core/services/models/part-entity.service'
import { Part } from '../../../core/models/part'
import { PieceGrouper } from '../../services/piece-grouper.service'
import { PieceLayer } from '../../../shared/enums/piece-layer'
import { Piece } from '../../../core/models/piece'

@Component({
  selector: 'sofie-offsetable-part',
  templateUrl: './offsetable-part.component.html',
  styleUrls: ['./offsetable-part.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'offsetable-part' },
})
export class OffsetablePartComponent implements OnChanges {
  @Input()
  public part: Part

  @Input()
  public pieceLayers: PieceLayer[]

  @Input()
  public pixelsPerSecond: number

  @Input()
  public offsetDurationInMs: number

  @Input()
  public minimumDisplayDurationInMs: number = 0

  public piecesGroupedByPieceLayer: Record<PieceLayer, Piece[]> = {} as Record<PieceLayer, Piece[]>

  public constructor(
      private readonly partEntityService: PartEntityService,
      private readonly pieceGrouper: PieceGrouper
  ) {}

  @HostBinding('style.width.px')
  public get hostWidthInPixels(): number {
    const displayDurationInMs: number = Math.max(this.partDurationInMs - this.offsetDurationInMs, this.minimumDisplayDurationInMs)
    return this.pixelsPerSecond * displayDurationInMs / 1000
  }

  public get partDurationInMs(): number {
    return this.partEntityService.getDuration(this.part)
  }

  public ngOnChanges(): void {
    this.piecesGroupedByPieceLayer = this.pieceGrouper.groupByPieceLayer(this.part.pieces)
  }

  public trackPiece(_: number, piece: Piece): string {
    return piece.id
  }
}
