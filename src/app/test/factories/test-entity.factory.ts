import { Part } from '../../core/models/part'
import { Segment } from '../../core/models/segment'
import { Rundown } from '../../core/models/rundown'
import { Piece } from '../../core/models/piece'
import { RundownTimingType } from '../../core/enums/rundown-timing-type'

export class TestEntityFactory {
  public createRundown(rundown: Partial<Rundown> = {}): Rundown {
    return {
      id: 'rundown-id',
      name: 'Rundown',
      isActive: false,
      segments: [],
      infinitePieces: [],
      modifiedAt: 0,
      timing: {
        type: RundownTimingType.UNSCHEDULED,
      },
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
      isUnsynced: false,
      isUntimed: false,
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
      isUnsynced: false,
      pieces: [],
      executedAt: 0,
      playedDuration: 0,
      isPlanned: true,
      isUntimed: false,
      ...part,
    }
  }

  public createPiece(piece: Partial<Piece> = {}): Piece {
    return {
      id: 'piece-id',
      partId: 'partId',
      name: 'Piece',
      layer: 'layer-id',
      start: 0,
      isPlanned: true,
      ...piece,
    }
  }
}
