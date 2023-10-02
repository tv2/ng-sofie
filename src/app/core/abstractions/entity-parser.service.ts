import { BasicRundown } from '../models/basic-rundown'
import { Rundown } from '../models/rundown'
import { Segment } from '../models/segment'
import { Part } from '../models/part'
import { Piece } from '../models/piece'

export abstract class EntityParser {
  public abstract parseBasicRundown(basicRundown: unknown): BasicRundown
  public abstract parseBasicRundowns(basicRundowns: unknown): BasicRundown[]
  public abstract parseRundown(rundown: unknown): Rundown
  public abstract parseSegment(segment: unknown): Segment
  public abstract parsePart(part: unknown): Part
  public abstract parsePiece(piece: unknown): Piece
}
