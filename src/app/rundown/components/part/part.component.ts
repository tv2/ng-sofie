import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core'
import { Part } from '../../../core/models/part'
import { Piece } from '../../../core/models/piece'
import { PieceLayerService } from '../../../shared/services/piece-layer.service'
import { PieceLayer } from '../../../shared/enums/piece-layer'
import { RundownService } from '../../../core/abstractions/rundown.service'
import { PartEntityService } from '../../../core/services/models/part-entity.service'

@Component({
  selector: 'sofie-part',
  templateUrl: './part.component.html',
  styleUrls: ['./part.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartComponent implements OnChanges {
  @Input()
  public time: number

  @Input()
  public rundownId: string

  @Input()
  public part: Part

  @Input()
  public pieceLayers: PieceLayer[]

  @Input()
  public pixelsPerSecond: number

  public layeredPieces: Piece[][] = []
  public partWidthInPixels: string = '0px'
  public duration: number = 4000
  // TODO: Remove this.
  public DEFAULT_PART_DURATION_IN_MS = 4000

  public constructor(
    public readonly pieceLayerService: PieceLayerService,
    private readonly partEntityService: PartEntityService,
    private readonly rundownService: RundownService
  ) {}

  public setPartAsNext(): void {
    this.rundownService.setNext(this.rundownId, this.part.segmentId, this.part.id).subscribe()
  }

  public getPiecesOnLayers(): Piece[][] {
    const piecesGroupedByLayer: Record<PieceLayer, Piece[]> = this.getGroupedPiecesByLayer()
    return this.pieceLayers.map(layer => piecesGroupedByLayer[layer] ?? [])
  }

  private getGroupedPiecesByLayer(): Record<PieceLayer, Piece[]> {
    return this.part.pieces.reduce((groups: Record<PieceLayer, Piece[]>, piece) => {
      const pieceLayer: PieceLayer = this.pieceLayerService.getPieceLayer(piece)
      if (!(pieceLayer in groups)) {
        groups[pieceLayer] = []
      }
      groups[pieceLayer].push(piece)
      return groups
    }, {} as Record<PieceLayer, Piece[]>)
  }

  // TODO: Memoize this such that it is not computed 1000000 times a second.
  public getPartWidthInPixels(): string {
    const width = this.getPartWidth()
    return `${width}px`
  }

  private getPartWidth(): number {
    const duration = this.partEntityService.getDuration(this.part)
    return Math.floor(this.pixelsPerSecond * duration / 1000)
  }

  public ngOnChanges(): void {
    this.layeredPieces = this.getPiecesOnLayers()
    this.partWidthInPixels = this.getPartWidthInPixels()
    this.duration = this.partEntityService.getDuration(this.part)
  }
}
