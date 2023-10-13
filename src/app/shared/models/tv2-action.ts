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
  VIDEO_CLIP = 'VIDEO_CLIP',
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
    cameraNumber: number
  }
}
