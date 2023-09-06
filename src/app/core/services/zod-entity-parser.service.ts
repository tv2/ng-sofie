import { EntityParser } from './entity-parser.interface'
import { AdLibPiece } from '../models/ad-lib-piece'
import { BasicRundown } from '../models/basic-rundown'
import { Part } from '../models/part'
import { Piece } from '../models/piece'
import { Rundown } from '../models/rundown'
import { Segment } from '../models/segment'
import { adLibPieceSchema } from '../schemas/ad-lib-piece.schema'
import { basicRundownSchema, basicRundownsSchema } from '../schemas/basic-rundown'
import { partSchema } from '../schemas/part.schema'
import { rundownSchema } from '../schemas/rundown.schema'
import { segmentSchema } from '../schemas/segment.schema'
import { pieceSchema } from '../schemas/piece.schema'

export class ZodEntityParser implements EntityParser {
    public parseBasicRundown(basicRundown: unknown): BasicRundown {
        return basicRundownSchema.parse(basicRundown)
    }

    public parseBasicRundowns(basicRundowns: unknown): BasicRundown[] {
        return basicRundownsSchema.parse(basicRundowns)
    }

    public parseRundown(rundown: unknown): Rundown {
        return new Rundown(rundownSchema.parse(rundown))
    }

    public parseSegment(segment: unknown): Segment {
        return new Segment(segmentSchema.parse(segment))
    }

    public parsePart(part: unknown): Part {
        return new Part(partSchema.parse(part))
    }

    public parsePiece(piece: unknown): Piece {
        return pieceSchema.parse(piece)
    }

    public parseAdLibPiece(adLibPiece: unknown): AdLibPiece {
        return adLibPieceSchema.parse(adLibPiece)
    }
}
