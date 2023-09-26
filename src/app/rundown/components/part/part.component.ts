import { Component, Input, OnChanges } from '@angular/core'
import { Part } from '../../../core/models/part'
import { Piece } from '../../../core/models/piece'
import { PieceLayerService } from '../../../shared/services/piece-layer.service'
import { PieceLayer } from '../../../shared/enums/piece-layer'
import { RundownService } from '../../../core/abstractions/rundown.service'

@Component({
  selector: 'sofie-part',
  templateUrl: './part.component.html',
  styleUrls: ['./part.component.scss']
})
export class PartComponent implements OnChanges {
  // TODO: Figure out how to "subscribe" to changes for this on the part property.
  @Input()
  public isOnAir: boolean

  @Input()
  public time: number

  @Input()
  public timeOffset: number = 0

  @Input()
  public minimumDisplayDuration: number = 0

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
    return this.part.pieces.concat(this.part.adLibPieces).reduce((groups: Record<PieceLayer, Piece[]>, piece) => {
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
    const duration = this.part.getDuration()
    const displayDuration = Math.max(duration - this.timeOffset, this.minimumDisplayDuration)
    return Math.floor(this.pixelsPerSecond * displayDuration / 1000)
  }

  public ngOnChanges(): void {
    this.layeredPieces = this.getPiecesOnLayers()
    this.partWidthInPixels = this.getPartWidthInPixels()
    this.duration = this.part.getDuration()
  }
}
