import { Piece } from '../../core/models/piece'
import { Part } from '../../core/models/part'
import { PieceLayer } from '../enums/piece-layer'

export class PieceLayerService {
  public getPieceLayersForParts(parts: Part[]): Set<PieceLayer> {
    const pieces: Piece[] = parts.flatMap(part => part.pieces)
    const pieceLayers: PieceLayer[] = pieces.map(piece => this.getPieceLayer(piece))
    return new Set(pieceLayers)
  }

  //TODO: Does not account for the fact that a JINGLE should be PGM when in the KLAR ON AIR (if this is desired behaviour?)
  // TODO: This should not use source layer to determine piece layers.
  public getPieceLayer(piece: Piece): PieceLayer {
    if (piece.name.includes('CLEAR')) {
      return PieceLayer.SEC
    }
    if ([
      'studio0_pilotOverlay',
      'studio0_graphicsHeadline',
      'studio0_overlay',
      'studio0_graphicsTema',
      'studio0_graphicsLower',
      'studio0_graphicsIdent',
    ].includes(piece.layer)) {
      return PieceLayer.OVERLAY
    }
    if ([
      'studio0_jingle',
    ].includes(piece.layer)) {
      return PieceLayer.JINGLE
    }
    if (piece.layer === 'studio0_script') {
      return PieceLayer.MANUS
    }
    if ([
      'studio0_robot_camera',
    ].includes(piece.layer)) {
      return PieceLayer.SEC
    }
    if ([
      'studio0_schema',
      'studio0_full_back',
      'studio0_dve_back',
      'studio0_design',
    ].includes(piece.layer)) {
      return PieceLayer.UNKNOWN
    }
    return PieceLayer.PGM
  }

  public getPieceLayersInOrder(): PieceLayer[] {
    return [
      PieceLayer.OVERLAY,
      PieceLayer.PGM,
      PieceLayer.JINGLE,
      PieceLayer.MUSIK,
      PieceLayer.MANUS,
      PieceLayer.ADLIB,
      PieceLayer.SEC,
      PieceLayer.AUX,
    ]
  }
}
