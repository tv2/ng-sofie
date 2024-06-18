import { PieceLifespan } from 'src/app/core/models/piece-lifespan'
import { KeyEventType } from 'src/app/keyboard/value-objects/key-event-type'
import { ActionTrigger } from 'src/app/shared/models/action-trigger'
import { PartActionType } from 'src/app/shared/models/action-type'
import { KeyboardTriggerData } from 'src/app/shared/models/keyboard-trigger-data'
import { Tv2ActionContentType, Tv2PartAction, Tv2VideoClipAction } from 'src/app/shared/models/tv2-action'
import { RundownMode } from '../../core/enums/rundown-mode'
import { RundownTimingType } from '../../core/enums/rundown-timing-type'
import { Part } from '../../core/models/part'
import { Piece } from '../../core/models/piece'
import { Rundown } from '../../core/models/rundown'
import { AutoNextStartedEvent, PartSetAsNextEvent, RundownResetEvent } from '../../core/models/rundown-event'
import { RundownEventType } from '../../core/models/rundown-event-type'
import { Segment } from '../../core/models/segment'
import { Tv2SegmentMetadata } from '../../core/models/tv2-segment-metadata'
import { StudioConfiguration } from '../../shared/models/studio-configuration'
import { Media } from '../../shared/services/media'

type AugmentedPiece = Piece & {
  isSpanned?: boolean
}

export class TestEntityFactory {
  public static createRundown(rundown: Partial<Rundown> = {}): Rundown {
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

  public static createSegment(segment: Partial<Segment> = {}): Segment {
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

  public static createPart(part: Partial<Part> = {}): Part {
    return {
      id: 'part-id',
      segmentId: 'segment-id',
      rank: 0,
      isNext: false,
      isOnAir: false,
      pieces: [this.createPiece()],
      executedAt: 0,
      playedDuration: 0,
      isPlanned: true,
      isUntimed: false,
      isUnsynced: false,
      replacedPieces: [],
      ...part,
    }
  }

  public static createPiece(piece: Partial<Piece> = {}): Piece {
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
  public static createAugmentedPiece(piece: Partial<Piece> = {}): AugmentedPiece {
    return { ...TestEntityFactory.createPiece(piece), isSpanned: true }
  }

  public static createActionTrigger(actionTrigger: Partial<ActionTrigger<KeyboardTriggerData>> = {}): ActionTrigger<KeyboardTriggerData> {
    return {
      id: 'action-trigger-id',
      actionId: 'action-trigger-action-id',
      data: {
        keys: ['random-key'],
        actionArguments: 100,
        label: 'random-label',
        triggerOn: KeyEventType.RELEASED,
        overrideColor: '',
      },
      ...actionTrigger,
    }
  }

  public static createAction(actionTrigger: Partial<Tv2PartAction> = {}): Tv2PartAction {
    return {
      id: 'action-id',
      name: 'action-name',
      rank: 0,
      type: PartActionType.INSERT_PART_AS_ON_AIR,
      description: 'action-description',
      metadata: {
        contentType: Tv2ActionContentType.CAMERA,
      },
      ...actionTrigger,
    }
  }

  public static createMiniShelfSegment(params?: { id?: string; name?: string; miniShelfVideoClipFile?: string }): Segment {
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

  public static createTv2VideoClipAction(name?: string, fileName?: string): Tv2VideoClipAction {
    return {
      id: `actionId_${fileName ?? 'someFileName'}`,
      name: name ?? 'actionName',
      metadata: {
        contentType: Tv2ActionContentType.VIDEO_CLIP,
        fileName: fileName ?? 'someFileName',
      },
    } as Tv2VideoClipAction
  }

  public static createRundownResetEvent(rundownResetEvent: Partial<RundownResetEvent> = {}): RundownResetEvent {
    return {
      type: RundownEventType.RESET,
      ...rundownResetEvent,
    } as RundownResetEvent
  }

  public static createAutoNextStartedEvent(autoNextStartedEvent: Partial<AutoNextStartedEvent> = {}): AutoNextStartedEvent {
    return {
      type: RundownEventType.AUTO_NEXT_STARTED,
      ...autoNextStartedEvent,
    } as AutoNextStartedEvent
  }

  public static createPartSetAsNextEvent(partSetAsNextEvent: Partial<PartSetAsNextEvent> = {}): PartSetAsNextEvent {
    return {
      type: RundownEventType.SET_NEXT,
      ...partSetAsNextEvent,
    } as PartSetAsNextEvent
  }

  public static createStudioConfiguration(studioConfiguration: Partial<StudioConfiguration> = {}): StudioConfiguration {
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

  public static createMedia(media: Partial<Media> = {}): Media {
    return {
      id: 'media-id',
      sourceName: 'media',
      duration: 5 * 60 * 1000,
      ...media,
    }
  }
}
