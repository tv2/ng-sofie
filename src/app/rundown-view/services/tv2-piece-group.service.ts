import { Injectable } from '@angular/core'
import { Tv2OutputLayer } from '../../core/models/tv2-output-layer'
import { Tv2Piece } from '../../core/models/tv2-piece'

@Injectable()
export class Tv2PieceGroupService {
  // todo: should be private and fix specs too
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

  public groupByOutputLayerThenStart(pieces: Tv2Piece[]): Record<Tv2OutputLayer, Record<number, Tv2Piece[]>> {
    const piecesByLayer = this.groupByOutputLayer(pieces)
    const piecesByLayerKeys = Object.keys(piecesByLayer) as Tv2OutputLayer[]
    const outputLayerStacks: Record<Tv2OutputLayer, Record<number, Tv2Piece[]>> = {} as Record<Tv2OutputLayer, Record<number, Tv2Piece[]>>

    for (const outputLayer of piecesByLayerKeys) {
      outputLayerStacks[outputLayer] = piecesByLayer[outputLayer].reduce(
        (stacks: Record<number, Tv2Piece[]>, piece: Tv2Piece) => {
          if (!stacks[piece.start]) {
            stacks[piece.start] = []
          }
          stacks[piece.start].push(piece)
          return stacks
        },
        {} as Record<number, Tv2Piece[]>
      )
    }

    return outputLayerStacks
  }
}
