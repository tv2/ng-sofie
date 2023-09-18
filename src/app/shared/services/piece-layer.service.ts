import { Piece } from '../../core/models/piece'
import {Part} from "../../core/models/part";

export class PieceLayerService {
    public getPieceLayersForParts(parts: Part[]): string[] {
        const pieceLayers: string[] = []
        parts.forEach(part => {
            part.pieces.forEach(piece => {
                const layer = this.getPieceLayer(piece)
                if (!pieceLayers.includes(layer) && layer !== 'UNKNOWN') {
                    pieceLayers.push(layer)
                }
            })
        })

        return pieceLayers
    }

    //TODO: Does not account for the fact that a JINGLE should be PGM when in the KLAR ON AIR (if this is desired behaviour?)
    public getPieceLayer(piece: Piece): string {
        if (piece.name.includes('CLEAR')) {
            piece.name = 'CLEAR'
            return 'SEC'
        }
        if ([
            'studio0_pilotOverlay',
            'studio0_graphicsHeadline',
            'studio0_overlay',
            'studio0_graphicsTema',
            'studio0_graphicsLower',
            'studio0_graphicsIdent',
        ].includes(piece.layer)) {
            return 'OVERLAY'
        }
        if ([
            'studio0_jingle',
        ].includes(piece.layer)) {
            return 'JINGLE'
        }
        if (piece.layer === 'studio0_script') {
            return 'MANUS'
        }
        if ([
            'studio0_robot_camera',
        ].includes(piece.layer)) {
            return 'SEC'
        }
        if ([
            'studio0_schema',
            'studio0_full_back',
            'studio0_dve_back',
            'studio0_design',
        ].includes(piece.layer)) {
            return 'UNKNOWN'
        }
        return 'PGM'
    }
}
