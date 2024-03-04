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

  public makeOutputLayerStacks(pieces: Tv2Piece[]): Record<Tv2OutputLayer, Record<number, Tv2Piece[]>> {
    const piecesByLayers = this.groupByOutputLayer(pieces)
    const piecesByLayerKeys = Object.keys(piecesByLayers) as Tv2OutputLayer[]
    const outputLayerStacks: Record<Tv2OutputLayer, Record<number, Tv2Piece[]>> = {} as Record<Tv2OutputLayer, Record<number, Tv2Piece[]>>

    piecesByLayerKeys.forEach((outputLayer: Tv2OutputLayer) => {
      const piecesForLayer: Tv2Piece[] = piecesByLayers[outputLayer]
      const piecesForLayerStacks: Record<number, Tv2Piece[]> = {} as Record<number, Tv2Piece[]>
      outputLayerStacks[outputLayer] = piecesForLayer.reduce((stacks: Record<number, Tv2Piece[]>, piece: Tv2Piece) => {
        const pieceStart: number = piece.start
        if (!(pieceStart in stacks)) {
          stacks[pieceStart] = []
        }
        stacks[pieceStart].push(piece)
        return stacks
      }, piecesForLayerStacks)
    })
    return outputLayerStacks
  }
}
