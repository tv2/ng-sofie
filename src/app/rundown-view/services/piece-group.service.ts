import { Piece } from '../../core/models/piece'
import { Injectable } from '@angular/core'
import { Tv2OutputLayer } from '../../core/models/tv2-output-layer'

@Injectable()
export class PieceGroupService {
  public groupByOutputLayer(pieces: Piece[]): Record<Tv2OutputLayer, Piece[]> {
    return pieces.reduce(
      (outputLayerGroups: Record<Tv2OutputLayer, Piece[]>, piece: Piece) => {
         // TODO: check why this is called so many times.
        const outputLayer: Tv2OutputLayer = piece.outputLayer
        if (!(outputLayer in outputLayerGroups)) {
          outputLayerGroups[outputLayer] = []
        }
        outputLayerGroups[outputLayer].push(piece)
        return outputLayerGroups
      },
      {} as Record<Tv2OutputLayer, Piece[]>
    )
  }
}
