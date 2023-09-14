import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core'
import { Part } from '../../../core/models/part'
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Piece } from '../../../core/models/piece'
import { PieceLayerService } from '../../../shared/services/piece-layer.service'

const DEFAULT_PART_DURATION = 4000

@Component({
  selector: 'sofie-part',
  templateUrl: './part.component.html',
  styleUrls: ['./part.component.scss'],
  animations: [
    trigger('onAirTrigger', [
      state('onAir', style({
        backgroundColor: 'red'
      })),
      state('offAir', style({

      })),
      state('isNext', style({
        backgroundColor: 'green'
      })),
      transition('offAir => onAir', animate(500)),
      transition('offAir => isNext', animate(500)),
      transition('onAir => isNext', animate(500))
    ]),
  ]
})
export class PartComponent implements OnChanges {

  @Input()
  public isRundownActive: boolean

  @Input()
  public part: Part

  @Input()
  public pieceLayers: string[]

  @Input()
  public pixelsPerSecond: number

  @Output()
  public readonly partSelectedAsNextEvent: EventEmitter<string> = new EventEmitter()

  public layeredPieces: Piece[][] = []
  public partWidth: string = '0px'

  public constructor(private readonly pieceLayerService: PieceLayerService) { return }

  public setPartAsNext(): void {
    this.partSelectedAsNextEvent.emit(this.part.id)
  }

  public getPiecesOnLayers(): Piece[][] {
    const groupedLayers = this.getGroupedPiecesByLayer()
    return this.pieceLayers.map(layer => groupedLayers[layer] ?? [])
  }

  private getGroupedPiecesByLayer(): Record<string, Piece[]> {
    return this.part.pieces.reduce((groups: Record<string, Piece[]>, piece) => {
      const pieceLayer = this.pieceLayerService.getPieceLayer(piece)
      if (!(pieceLayer in groups)) {
        groups[pieceLayer] = []
      }
      groups[pieceLayer].push(piece)
      return groups
    }, {})
  }

  public getPartWidthInPixels(): string {
    const width = this.getPartWidth()
    return `${width}px`
  }

  private getPartWidth(): number {
    const expectedDuration = this.part.expectedDuration ?? DEFAULT_PART_DURATION
    return Math.floor(this.pixelsPerSecond * expectedDuration / 1000)
  }

  public ngOnChanges(): void {
    this.layeredPieces = this.getPiecesOnLayers()
    this.partWidth = this.getPartWidthInPixels()
  }
}
