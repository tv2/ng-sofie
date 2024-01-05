import { BasicRundown } from '../models/basic-rundown'
import { Rundown } from '../models/rundown'
import { Segment } from '../models/segment'
import { Part } from '../models/part'
import { ShowStyleVariant } from '../models/show-style-variant'
import { Tv2Piece } from '../models/tv2-piece'

export abstract class EntityValidator {
  public abstract validateBasicRundown(basicRundown: unknown): BasicRundown
  public abstract validateBasicRundowns(basicRundowns: unknown[]): BasicRundown[]
  public abstract validateRundown(rundown: unknown): Rundown
  public abstract validateSegment(segment: unknown): Segment
  public abstract validatePart(part: unknown): Part
  public abstract validatePiece(piece: unknown): Tv2Piece
  public abstract validateShowStyleVariant(showStyleVariant: unknown): ShowStyleVariant
}
