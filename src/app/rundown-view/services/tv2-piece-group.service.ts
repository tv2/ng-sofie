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

  public mergePiecesByStartOffset(pieces: Tv2Piece[]): Tv2Piece[] {
    const piecesGroupedByStartOffset: Record<number, Tv2Piece[]> = this.groupPiecesByStartOffset(pieces)
    return this.combinePiecesByStartOffset(piecesGroupedByStartOffset)
  }

  private groupPiecesByStartOffset(pieces: Tv2Piece[]): Record<number, Tv2Piece[]> {
    return pieces.reduce(
      (startTimes, piece) => {
        const piecesAtStartTime: Tv2Piece[] = startTimes[piece.start] ?? []
        return {
          ...startTimes,
          [piece.start]: [...piecesAtStartTime, piece],
        }
      },
      {} as Record<number, Tv2Piece[]>
    )
  }

  private combinePiecesByStartOffset(piecesGroupedByStartOffset: Record<number, Tv2Piece[]>): Tv2Piece[] {
    return Object.values(piecesGroupedByStartOffset).reduce((reducedPieces, pieces) => {
      const sortedPieces: Tv2Piece[] = [...pieces].sort((pieceA, pieceB) => pieceB.start - pieceA.start)
      const basePiece: Tv2Piece = sortedPieces[0]
      return [
        ...reducedPieces,
        {
          ...basePiece,
          name: pieces.map(piece => piece.name).join(', '),
        },
      ]
    }, [])
  }
}
