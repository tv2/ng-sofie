import { BasicRundown } from '../models/basic-rundown'
import { Rundown } from '../models/rundown'
import { Segment } from '../models/segment'
import { Part } from '../models/part'
import { Piece } from '../models/piece'
import { ShowStyleVariant } from '../models/show-style-variant'
import { Configuration } from '../models/configuration'
import { Tv2Action } from '../../shared/models/tv2-action'
import { MediaData } from '../../shared/services/media-data'

export abstract class EntityParser {
  public abstract parseBasicRundown(basicRundown: unknown): BasicRundown
  public abstract parseBasicRundowns(basicRundowns: unknown): BasicRundown[]
  public abstract parseRundown(rundown: unknown): Rundown
  public abstract parseSegment(segment: unknown): Segment
  public abstract parsePart(part: unknown): Part
  public abstract parsePiece(piece: unknown): Piece
  public abstract parseShowStyleVariant(showStyleVariant: unknown): ShowStyleVariant
  public abstract parseStudioConfiguration(studioConfiguration: unknown): Configuration
  public abstract parseTv2Action(tv2Action: unknown): Tv2Action
  public abstract parseMediaData(mediaData: unknown): MediaData
}
