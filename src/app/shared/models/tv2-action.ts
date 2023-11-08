import { PartAction, PieceAction } from './action'

export type Tv2Action = Tv2PartAction | Tv2PieceAction

export interface Tv2PartAction extends PartAction {
  metadata: {
    contentType: Tv2ActionContentType
  }
}
export interface Tv2PieceAction extends PieceAction {
  metadata: {
    contentType: Tv2ActionContentType
  }
}

export enum Tv2ActionContentType {
  CAMERA = 'CAMERA',
  REMOTE = 'REMOTE',
  VIDEO_CLIP = 'VIDEO_CLIP',
  TRANSITION = 'TRANSITION',
  GRAPHICS = 'GRAPHICS',
  AUDIO = 'AUDIO',
  DVE = 'DVE',
  REPLAY = 'REPLAY',
  RECALL_DVE = 'RECALL_DVE',
  DVE_LAYOUT = 'DVE_LAYOUT',
  DVE_INSERT_SOURCE_TO_INPUT = 'DVE_INSERT_SOURCE_TO_INPUT',
  DVE_INSERT_LAST_VIDEO_CLIP_TO_INPUT = 'DVE_INSERT_LAST_VIDEO_CLIP_TO_INPUT',
  UNKNOWN = 'UNKNOWN',
}

export interface Tv2VideoClipAction extends Tv2PartAction {
  metadata: {
    contentType: Tv2ActionContentType.VIDEO_CLIP
    sourceName: string
  }
}

export interface Tv2CameraAction extends Tv2PartAction {
  metadata: {
    contentType: Tv2ActionContentType.CAMERA
    cameraNumber: string
  }
}

export interface Tv2RemoteAction extends Tv2PartAction {
  metadata: {
    contentType: Tv2ActionContentType.REMOTE
    remoteNumber: string
  }
}

export interface Tv2TransitionAction extends Tv2PartAction {
  metadata: {
    contentType: Tv2ActionContentType.TRANSITION
  }
}
