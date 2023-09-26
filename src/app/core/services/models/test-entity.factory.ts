import { Part } from '../../_models/part'
import { Segment } from '../../_models/segment'
import { Rundown } from '../../_models/rundown'
import { Piece } from '../../_models/piece'
import { PieceType } from '../../enums/piece-type'

export class TestEntityFactory {
    public createRundown(rundown: Partial<Rundown> = {}): Rundown {
        return {
            id: 'rundown-id',
            name: 'Rundown',
            isActive: false,
            segments: [],
            infinitePieces: {},
            modifiedAt: 0,
            ...rundown
        }
    }

    public createSegment(segment: Partial<Segment> = {}): Segment {
        return {
            id: 'segment-id',
            rundownId: 'rundown-id',
            name: 'Segment',
            isNext: false,
            isOnAir: false,
            parts: [],
            ...segment
        }
    }

    public createPart(part: Partial<Part> = {}): Part {
        return {
            id: 'part-id',
            segmentId: 'segment-id',
            isNext: false,
            isOnAir: false,
            pieces: [],
            executedAt: 0,
            playedDuration: 0,
            ...part
        }
    }

    public createPiece(piece: Partial<Piece> = {}): Piece {
        return {
            id: 'piece-id',
            partId: 'partId',
            name: 'Piece',
            type: PieceType.UNKNOWN,
            layer: 'layer-id',
            start: 0,
            ...piece,
        }
    }
}
