import { EntityParser } from '../abstractions/entity-parser.service'
import { AdLibPiece } from '../models/ad-lib-piece'
import { BasicRundown } from '../models/basic-rundown'
import { Part } from '../models/part'
import { Piece } from '../models/piece'
import { Rundown } from '../models/rundown'
import { Segment } from '../models/segment'
import * as zod from 'zod'


export class ZodEntityParser implements EntityParser {
    private readonly pieceParser = zod.object({
        id: zod.string().nonempty(),
        partId: zod.string().nonempty(),
        name: zod.string().nonempty(),
        layer: zod.string().nonempty(),
    })

    private readonly adLibPieceParser = this.pieceParser.extend({
        start: zod.number(),
        duration: zod.number(),
    })

    private readonly partParser = zod.object({
        id: zod.string().nonempty(),
        segmentId: zod.string().nonempty(),
        isOnAir: zod.boolean(),
        isNext: zod.boolean(),
        pieces: this.pieceParser.array()
    })

    private readonly segmentParser = zod.object({
        id: zod.string().nonempty(),
        rundownId: zod.string().nonempty(),
        name: zod.string().nonempty(),
        isOnAir: zod.boolean(),
        isNext: zod.boolean(),
        parts: this.partParser.array(),
    })

    private readonly basicRundownParser = zod.object({
        id: zod.string().nonempty(),
        name: zod.string().nonempty(),
        isActive: zod.boolean(),
        modifiedAt: zod.number(),
    })

    private readonly basicRundownsParser = this.basicRundownParser.array()

    private readonly rundownParser = this.basicRundownParser.extend({
        segments: zod.array(this.segmentParser),
        infinitePieces: zod.array(this.pieceParser),
    })

    public parsePiece(piece: unknown): Piece {
        return this.pieceParser.parse(piece)
    }

    public parseAdLibPiece(adLibPiece: unknown): AdLibPiece {
        return this.adLibPieceParser.parse(adLibPiece)
    }

    public parsePart(part: unknown): Part {
        return new Part(this.partParser.parse(part))
    }

    public parseSegment(segment: unknown): Segment {
        return new Segment(this.segmentParser.parse(segment))
    }

    public parseBasicRundown(basicRundown: unknown): BasicRundown {
        return this.basicRundownParser.parse(basicRundown)
    }

    public parseBasicRundowns(basicRundowns: unknown): BasicRundown[] {
        return this.basicRundownsParser.parse(basicRundowns)
    }

    public parseRundown(rundown: unknown): Rundown {
        return new Rundown(this.rundownParser.parse(rundown))
    }
}
