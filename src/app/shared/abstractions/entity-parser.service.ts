import { BasicRundown } from '../../core/models/basic-rundown'
import { Rundown } from '../../core/models/rundown'
import { Segment } from '../../core/models/segment'
import { Part } from '../../core/models/part'
import { Piece } from '../../core/models/piece'
import { ShowStyleVariant } from '../../core/models/show-style-variant'

export abstract class EntityParser {
  public abstract parseBasicRundown(basicRundown: unknown): BasicRundown
  public abstract parseBasicRundowns(basicRundowns: unknown): BasicRundown[]
  public abstract parseRundown(rundown: unknown): Rundown
  public abstract parseSegment(segment: unknown): Segment
  public abstract parsePart(part: unknown): Part
  public abstract parsePiece(piece: unknown): Piece
  public abstract parseShowStyleVariant(showStyleVariant: unknown): ShowStyleVariant
}
