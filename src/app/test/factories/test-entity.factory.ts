import { Part } from '../../core/models/part'
import { Segment } from '../../core/models/segment'
import { Rundown } from '../../core/models/rundown'
import { Piece } from '../../core/models/piece'
import { RundownTimingType } from '../../core/enums/rundown-timing-type'
import { ActionTrigger } from 'src/app/shared/models/action-trigger'
import { Tv2ActionContentType, Tv2PartAction, Tv2VideoClipAction } from 'src/app/shared/models/tv2-action'
import { PartActionType } from 'src/app/shared/models/action-type'
import { KeyEventType } from 'src/app/keyboard/value-objects/key-event-type'
import { KeyboardTriggerData } from 'src/app/shared/models/keyboard-trigger-data'
import { StudioConfiguration } from '../../shared/models/studio-configuration'
import { Media } from '../../shared/services/media'
import { PieceLifespan } from 'src/app/core/models/piece-lifespan'
import { AutoNextStartedEvent, PartSetAsNextEvent, RundownResetEvent } from '../../core/models/rundown-event'
import { RundownEventType } from '../../core/models/rundown-event-type'
import { Tv2SegmentMetadata } from '../../core/models/tv2-segment-metadata'
import { RundownMode } from '../../core/enums/rundown-mode'

export class TestEntityFactory {
  public createRundown(rundown: Partial<Rundown> = {}): Rundown {
    return {
      id: 'rundown-id',
      name: 'Rundown',
      mode: RundownMode.INACTIVE,
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
      isHidden: false,
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
      lifespan: PieceLifespan.WITHIN_PART,
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
        triggerOn: KeyEventType.RELEASED,
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

  public createMiniShelfSegment(params?: { id?: string; name?: string; miniShelfVideoClipFile?: string }): Segment {
    const segmentMetadata: Tv2SegmentMetadata = {
      miniShelfVideoClipFile: params?.miniShelfVideoClipFile ?? 'someFileName',
    }
    return this.createSegment({
      id: params?.id ?? 'segmentId',
      name: params?.name ?? 'segmentName',
      isHidden: true,
      metadata: segmentMetadata,
    })
  }

  public createTv2VideoClipAction(name?: string, fileName?: string): Tv2VideoClipAction {
    return {
      id: `actionId_${fileName ?? 'someFileName'}`,
      name: name ?? 'actionName',
      metadata: {
        contentType: Tv2ActionContentType.VIDEO_CLIP,
        fileName: fileName ?? 'someFileName',
      },
    } as Tv2VideoClipAction
  }

  public createRundownResetEvent(rundownResetEvent: Partial<RundownResetEvent> = {}): RundownResetEvent {
    return {
      type: RundownEventType.RESET,
      ...rundownResetEvent,
    } as RundownResetEvent
  }

  public createAutoNextStartedEvent(autoNextStartedEvent: Partial<AutoNextStartedEvent> = {}): AutoNextStartedEvent {
    return {
      type: RundownEventType.AUTO_NEXT_STARTED,
      ...autoNextStartedEvent,
    } as AutoNextStartedEvent
  }

  public createPartSetAsNextEvent(partSetAsNextEvent: Partial<PartSetAsNextEvent> = {}): PartSetAsNextEvent {
    return {
      type: RundownEventType.SET_NEXT,
      ...partSetAsNextEvent,
    } as PartSetAsNextEvent
  }

  public createStudioConfiguration(studioConfiguration: Partial<StudioConfiguration> = {}): StudioConfiguration {
    return {
      settings: {
        mediaPreviewUrl: 'http://media.preview.url',
      },
      blueprintConfiguration: {
        ServerPostrollDuration: 4200,
      },
      ...studioConfiguration,
    }
  }

  public createMedia(media: Partial<Media> = {}): Media {
    return {
      id: 'media-id',
      sourceName: 'media',
      duration: 5 * 60 * 1000,
      ...media,
    }
  }
}
