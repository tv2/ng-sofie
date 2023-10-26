import { Part } from '../../models/part'
import { Segment } from '../../models/segment'
import { Rundown } from '../../models/rundown'
import { Piece } from '../../models/piece'
import { Tv2PieceType } from '../../enums/tv2-piece-type'

export class TestEntityFactory {
  public createRundown(rundown: Partial<Rundown> = {}): Rundown {
    return {
      id: 'rundown-id',
      name: 'Rundown',
      isActive: false,
      segments: [],
      infinitePieces: [],
      modifiedAt: 0,
      ...rundown,
    }
  }

  public createSegment(segment: Partial<Segment> = {}): Segment {
    return {
      id: 'segment-id',
      rundownId: 'rundown-id',
      name: 'Segment',
      isNext: false,
      isOnAir: false,
      parts: [],
      ...segment,
    }
  }

  public createPart(part: Partial<Part> = {}): Part {
    return {
      id: 'part-id',
      segmentId: 'segment-id',
      isNext: false,
      isOnAir: false,
      pieces: [],
      executedAt: 0,
      playedDuration: 0,
      isPlanned: true,
      ...part,
    }
  }

  public createPiece(piece: Partial<Piece> = {}): Piece {
    return {
      id: 'piece-id',
      partId: 'partId',
      name: 'Piece',
      type: Tv2PieceType.UNKNOWN,
      layer: 'layer-id',
      start: 0,
      isPlanned: true,
      ...piece,
    }
  }
}
