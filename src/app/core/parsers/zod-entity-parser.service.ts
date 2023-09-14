import { EntityParserService } from '../abstractions/entity-parser.service'
import { AdLibPiece } from '../models/ad-lib-piece'
import { BasicRundown } from '../models/basic-rundown'
import { Part } from '../models/part'
import { Piece } from '../models/piece'
import { Rundown } from '../models/rundown'
import { Segment } from '../models/segment'
import * as zod from 'zod'
import { PieceType } from '../enums/piece-type'


export class ZodEntityParser implements EntityParserService {
    private PIECE_PARSER = zod.object({
        id: zod.string().nonempty(),
        type: zod.nativeEnum(PieceType),
        partId: zod.string().nonempty(),
        name: zod.string().nonempty(),
        layer: zod.string().nonempty(),
        start: zod.number(),
        duration: zod.number().optional(),
    })
    public parsePiece(piece: unknown): Piece {
        return this.PIECE_PARSER.parse(piece)
    }

    private AD_LIB_PIECE_PARSER = this.PIECE_PARSER.extend({
        start: zod.number(),
        duration: zod.number(),
    })
    public parseAdLibPiece(adLibPiece: unknown): AdLibPiece {
        return this.AD_LIB_PIECE_PARSER.parse(adLibPiece)
    }

    private PART_PARSER = zod.object({
        id: zod.string().nonempty(),
        segmentId: zod.string().nonempty(),
        isOnAir: zod.boolean(),
        isNext: zod.boolean(),
        pieces: this.PIECE_PARSER.array(),
        expectedDuration: zod.number().optional().or(zod.null()).transform(expectedDuration => expectedDuration ?? undefined), // TODO: Normalize the type to number | undefined
        executedAt: zod.number(),
    })
    public parsePart(part: unknown): Part {
        return new Part(this.PART_PARSER.parse(part))
    }

    private SEGMENT_PARSER = zod.object({
        id: zod.string().nonempty(),
        rundownId: zod.string().nonempty(),
        name: zod.string().nonempty(),
        isOnAir: zod.boolean(),
        isNext: zod.boolean(),
        parts: this.PART_PARSER.array(),
    })
    public parseSegment(segment: unknown): Segment {
        return new Segment(this.SEGMENT_PARSER.parse(segment))
    }

    private BASIC_RUNDOWN_PARSER = zod.object({
        id: zod.string().nonempty(),
        name: zod.string().nonempty(),
        isActive: zod.boolean(),
        modifiedAt: zod.number(),
    })
    public parseBasicRundown(basicRundown: unknown): BasicRundown {
        return this.BASIC_RUNDOWN_PARSER.parse(basicRundown)
    }

    private BASIC_RUNDOWNS_PARSER = this.BASIC_RUNDOWN_PARSER.array()
    public parseBasicRundowns(basicRundowns: unknown): BasicRundown[] {
        return this.BASIC_RUNDOWNS_PARSER.parse(basicRundowns)
    }

    private RUNDOWN_PARSER = this.BASIC_RUNDOWN_PARSER.extend({
        segments: zod.array(this.SEGMENT_PARSER),
        infinitePieces: zod.array(this.PIECE_PARSER),
    })
    public parseRundown(rundown: unknown): Rundown {
        return new Rundown(this.RUNDOWN_PARSER.parse(rundown))
    }
}
