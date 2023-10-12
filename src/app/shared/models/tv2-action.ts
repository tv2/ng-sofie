import { Action } from './action'
import { PartActionType } from './action-type'

export interface Tv2Action extends Action {
  metadata: {
    contentType: Tv2ActionContentType
  }
}

export enum Tv2ActionContentType {
  CAMERA = 'CAMERA',
  VIDEO_CLIP = 'VIDEO_CLIP',
}

export interface Tv2VideoClipAction extends Tv2Action {
  type: PartActionType
  metadata: {
    contentType: Tv2ActionContentType.VIDEO_CLIP
    sourceName: string
  }
}

export interface Tv2CameraAction extends Tv2Action {
  type: PartActionType
  metadata: {
    contentType: Tv2ActionContentType.CAMERA
    cameraNumber: number
  }
}
