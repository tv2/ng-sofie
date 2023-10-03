import { EntityParser } from '../abstractions/entity-parser.service'
import { BasicRundown } from '../models/basic-rundown'
import { Part } from '../models/part'
import { Piece } from '../models/piece'
import { Rundown } from '../models/rundown'
import { Segment } from '../models/segment'
import * as zod from 'zod'
import { PieceType } from '../enums/piece-type'

export class ZodEntityParser implements EntityParser {
  private readonly pieceParser = zod.object({
    id: zod.string().nonempty(),
    type: zod.nativeEnum(PieceType),
    partId: zod.string().nonempty(),
    name: zod.string().nonempty(),
    layer: zod.string().nonempty(),
    start: zod.number(),
    duration: zod.number().optional(),
  })

  private readonly partParser = zod.object({
    id: zod.string().nonempty(),
    segmentId: zod.string().nonempty(),
    isOnAir: zod.boolean(),
    isNext: zod.boolean(),
    pieces: this.pieceParser.array(),
    expectedDuration: zod
      .number()
      .nullish()
      .transform(expectedDuration => expectedDuration ?? undefined), // TODO: Normalize the type to number | undefined
    executedAt: zod.number(),
    playedDuration: zod.number(),
    autoNext: zod.object({ overlap: zod.number() }).optional(),
  })

  private readonly segmentParser = zod.object({
    id: zod.string().nonempty(),
    rundownId: zod.string().nonempty(),
    name: zod.string().nonempty(),
    isOnAir: zod.boolean(),
    isNext: zod.boolean(),
    parts: this.partParser.array(),
    budgetDuration: zod.number().optional(),
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

  public parsePart(part: unknown): Part {
    return this.partParser.parse(part)
  }

  public parseSegment(segment: unknown): Segment {
    return this.segmentParser.parse(segment)
  }

  public parseBasicRundown(basicRundown: unknown): BasicRundown {
    return this.basicRundownParser.parse(basicRundown)
  }

  public parseBasicRundowns(basicRundowns: unknown): BasicRundown[] {
    return this.basicRundownsParser.parse(basicRundowns)
  }

  public parseRundown(rundown: unknown): Rundown {
    return this.rundownParser.parse(rundown)
  }
}
