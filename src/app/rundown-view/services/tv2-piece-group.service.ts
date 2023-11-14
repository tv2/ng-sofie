import { Injectable } from '@angular/core'
import { Tv2OutputLayer } from '../../core/models/tv2-output-layer'
import { Tv2Piece } from '../../core/models/tv2-piece'

@Injectable()
export class Tv2PieceGroupService {
  public groupByOutputLayer(pieces: Tv2Piece[]): Record<Tv2OutputLayer, Tv2Piece[]> {
    return pieces.reduce(
      (outputLayerGroups: Record<Tv2OutputLayer, Tv2Piece[]>, piece: Tv2Piece) => {
        const outputLayer: Tv2OutputLayer | undefined = piece.metadata.outputLayer
        if (!outputLayer) {
          return outputLayerGroups
        }
        if (!(outputLayer in outputLayerGroups)) {
          outputLayerGroups[outputLayer] = []
        }
        outputLayerGroups[outputLayer].push(piece)
        return outputLayerGroups
      },
      {} as Record<Tv2OutputLayer, Tv2Piece[]>
    )
  }
}
