import { Part } from '../../core/models/part'
import { Segment } from '../../core/models/segment'
import { Rundown } from '../../core/models/rundown'
import { Piece } from '../../core/models/piece'
import { RundownTimingType } from '../../core/enums/rundown-timing-type'
import { ActionTrigger, KeyboardTriggerData } from 'src/app/shared/models/action-trigger'
import { Tv2ActionContentType, Tv2PartAction } from 'src/app/shared/models/tv2-action'
import { PartActionType } from 'src/app/shared/models/action-type'

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
      rank: 0,
      isNext: false,
      isOnAir: false,
      isUntimed: false,
      isUnsynced: false,
      parts: [],
      ...segment,
    }
  }

  public createPart(part: Partial<Part> = {}): Part {
    return {
      id: 'part-id',
      segmentId: 'segment-id',
      rank: 0,
      isNext: false,
      isOnAir: false,
      pieces: [],
      executedAt: 0,
      playedDuration: 0,
      isPlanned: true,
      isUntimed: false,
      isUnsynced: false,
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

  public createActionTrigger(actionTrigger: Partial<ActionTrigger<KeyboardTriggerData>> = {}): ActionTrigger<KeyboardTriggerData> {
    return {
      id: 'action-trigger-id',
      actionId: 'action-trigger-action-id',
      data: {
        keys: ['random-key'],
        actionArguments: 100,
        label: 'random-label',
      },
      ...actionTrigger,
    }
  }

  public createAction(actionTrigger: Partial<Tv2PartAction> = {}): Tv2PartAction {
    return {
      id: 'action-id',
      name: 'action-name',
      type: PartActionType.INSERT_PART_AS_ON_AIR,
      description: 'action-description',
      metadata: {
        contentType: Tv2ActionContentType.CAMERA,
      },
      ...actionTrigger,
    }
  }
}
