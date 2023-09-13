import { Piece } from '../../core/models/piece'

export class PieceLayerService {
    public getPieceLayer(piece: Piece): string {
        if (piece.layer === 'studio0_script') {
            return 'MANUS'
        }
        if ([
            'studio0_pilotOverlay',
            'studio0_graphicsHeadline',
            'studio0_overlay',
            'studio0_graphicsTema',
            'studio0_graphicsLower',
        ].includes(piece.layer)) {
            return 'OVERLAY'
        }
        if ([
            'studio0_schema',
            'studio0_design'
        ].includes(piece.layer)) {
            return 'UNKNOWN'
        }
        return 'PGM'
    }
}
