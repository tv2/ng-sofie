import { Piece } from '../../core/models/piece'
import { PieceLayer } from '../../shared/enums/piece-layer'
import { PieceLayerService } from '../../shared/services/piece-layer.service'
import { Injectable } from '@angular/core'

@Injectable()
export class PieceGroupService {
  constructor(private readonly pieceLayerService: PieceLayerService) {}

  public groupByPieceLayer(pieces: Piece[]): Record<PieceLayer, Piece[]> {
    return pieces.reduce(
      (pieceLayerGroups: Record<PieceLayer, Piece[]>, piece: Piece) => {
        const pieceLayer: PieceLayer = this.pieceLayerService.getPieceLayer(piece)
        if (!(pieceLayer in pieceLayerGroups)) {
          pieceLayerGroups[pieceLayer] = []
        }
        pieceLayerGroups[pieceLayer].push(piece)
        return pieceLayerGroups
      },
      {} as Record<PieceLayer, Piece[]>
    )
  }
}
