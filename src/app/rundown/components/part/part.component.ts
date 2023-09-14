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

  // TODO: Figure out how to "subscribe" to changes for this on the part property.
  @Input()
  public isOnAir: boolean

  @Input()
  public time: number

  @Input()
  public part: Part

  @Input()
  public pieceLayers: string[]

  @Input()
  public pixelsPerSecond: number

  @Output()
  public readonly partSelectedAsNextEvent: EventEmitter<string> = new EventEmitter()

  public layeredPieces: Piece[][] = []
  public partWidthInPixels: string = '0px'
  public duration: number = 4000

  public constructor(private readonly pieceLayerService: PieceLayerService) {}

  public setPartAsNext(): void {
    this.partSelectedAsNextEvent.emit(this.part.id)
  }

  public getPiecesOnLayers(): Piece[][] {
    const groupedLayers = this.getGroupedPiecesByLayer()
    return this.pieceLayers.map(layer => groupedLayers[layer] ?? [])
  }

  private getGroupedPiecesByLayer(): Record<string, Piece[]> {
    return this.part.pieces.concat(this.part.adLibPieces).reduce((groups: Record<string, Piece[]>, piece) => {
      const pieceLayer = this.pieceLayerService.getPieceLayer(piece)
      if (!(pieceLayer in groups)) {
        groups[pieceLayer] = []
      }
      groups[pieceLayer].push(piece)
      return groups
    }, {})
  }

  // TODO: Memoize this such that it is not computed 1000000 times a second.
  public getPartWidthInPixels(): string {
    const width = this.getPartWidth()
    return `${width}px`
  }

  private getPartWidth(): number {
    const duration = this.part.getDuration()
    return Math.floor(this.pixelsPerSecond * duration / 1000)
  }

  public ngOnChanges(): void {
    this.layeredPieces = this.getPiecesOnLayers()
    this.partWidthInPixels = this.getPartWidthInPixels()
    this.duration = this.part.getDuration()
  }
}
