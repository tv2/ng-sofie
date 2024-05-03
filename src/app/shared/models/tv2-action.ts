import { ActionArgumentSchemaType, PartAction, PieceAction, PlaceholderAction } from './action'
import { PlaceholderActionScope, PlaceholderActionType } from './action-type'

export type Tv2Action = Tv2PartAction | Tv2PieceAction | Tv2PlaceholderAction

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
  SPLIT_SCREEN = 'SPLIT_SCREEN',
  REPLAY = 'REPLAY',
  ROBOT = 'ROBOT',
  PLACEHOLDER = 'PLACEHOLDER',
  UNKNOWN = 'UNKNOWN',
}

export interface Tv2VideoClipAction extends Tv2PartAction {
  metadata: {
    contentType: Tv2ActionContentType.VIDEO_CLIP
    fileName: string
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

export interface Tv2PlaceholderAction extends PlaceholderAction {
  metadata: {
    contentType: Tv2ActionContentType
  }
}

export interface Tv2ContentPlaceholderAction extends Tv2PlaceholderAction {
  type: PlaceholderActionType.CONTENT
  argument: {
    name: 'indexToSelect'
    description: string
    type: ActionArgumentSchemaType.NUMBER
  }
  metadata: {
    contentType: Tv2ActionContentType.PLACEHOLDER
    scope: PlaceholderActionScope.ON_AIR_SEGMENT
    allowedContentTypes: Tv2ActionContentType[]
  }
}
