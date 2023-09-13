import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core'
import { Part } from '../../../core/models/part'
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Piece } from '../../../core/models/piece'

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

  @Output()
  public readonly partSelectedAsNextEvent: EventEmitter<string> = new EventEmitter()

  public layeredPieces: Piece[][] = []

  public constructor() { return }

  public setPartAsNext(): void {
    this.partSelectedAsNextEvent.emit(this.part.id)
  }

  public getPiecesOnLayers(): Piece[][] {
    const groupedLayers = this.getGroupedPiecesByLayer()
    return this.pieceLayers.map(layer => groupedLayers[layer] ?? [])
  }

  private getGroupedPiecesByLayer(): Record<string, Piece[]> {
    return this.part.pieces.reduce((groups: Record<string, Piece[]>, piece) => {
      const pieceLayer = this.getPieceLayer(piece)
      if (!(pieceLayer in groups)) {
        groups[pieceLayer] = []
      }
      groups[pieceLayer].push(piece)
      return groups
    }, {})
  }

  private getPieceLayer(piece: Piece): string {
    if (piece.layer === 'studio0_script') {
      return 'MANUS'
    }
    if (['studio0_pilotOverlay'].includes(piece.layer)) {
      return 'OVERLAY'
    }
    return 'PGM'
  }

  public ngOnChanges(): void {
    console.log('Part changes')
    this.layeredPieces = this.getPiecesOnLayers()
  }
}
