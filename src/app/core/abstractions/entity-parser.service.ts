import { BasicRundown } from '../models/basic-rundown'
import { Rundown } from '../models/rundown'
import { Segment } from '../models/segment'
import { Part } from '../models/part'
import { Piece } from '../models/piece'
import { AdLibPiece } from '../models/ad-lib-piece'

export abstract class EntityParserService {
    public abstract parseBasicRundown(basicRundown: unknown): BasicRundown
    public abstract parseBasicRundowns(basicRundowns: unknown): BasicRundown[]
    public abstract parseRundown(rundown: unknown): Rundown
    public abstract parseSegment(segment: unknown): Segment
    public abstract parsePart(part: unknown): Part
    public abstract parsePiece(piece: unknown): Piece
    public abstract parseAdLibPiece(adLibPiece: unknown): AdLibPiece
}
