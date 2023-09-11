import { EntityParser } from '../abstractions/entity.parser'
import { AdLibPiece } from '../models/ad-lib-piece'
import { BasicRundown } from '../models/basic-rundown'
import { Part } from '../models/part'
import { Piece } from '../models/piece'
import { Rundown } from '../models/rundown'
import { Segment } from '../models/segment'
import { AD_LIB_PIECE_PARSER } from '../parsers/ad-lib-piece.schema'
import { BASIC_RUNDOWN_PARSER, BASIC_RUNDOWNS_PARSER } from '../parsers/basic-rundown.schema'
import { PART_PARSER } from '../parsers/part.schema'
import { RUNDOWN_PARSER } from '../parsers/rundown.schema'
import { SEGMENT_PARSER } from '../parsers/segment.schema'
import { PIECE_PARSER } from '../parsers/piece.schema'

export class ZodEntityParser implements EntityParser {
    public parseBasicRundown(basicRundown: unknown): BasicRundown {
        return BASIC_RUNDOWN_PARSER.parse(basicRundown)
    }

    public parseBasicRundowns(basicRundowns: unknown): BasicRundown[] {
        return BASIC_RUNDOWNS_PARSER.parse(basicRundowns)
    }

    public parseRundown(rundown: unknown): Rundown {
        return new Rundown(RUNDOWN_PARSER.parse(rundown))
    }

    public parseSegment(segment: unknown): Segment {
        return new Segment(SEGMENT_PARSER.parse(segment))
    }

    public parsePart(part: unknown): Part {
        return new Part(PART_PARSER.parse(part))
    }

    public parsePiece(piece: unknown): Piece {
        return PIECE_PARSER.parse(piece)
    }

    public parseAdLibPiece(adLibPiece: unknown): AdLibPiece {
        return AD_LIB_PIECE_PARSER.parse(adLibPiece)
    }
}
