import { Action } from './action'

export interface Tv2Action extends Action {
    metadata: {
        contentType: Tv2ActionContentType
    }
}

enum Tv2ActionContentType {
    CAMERA = 'CAMERA',
    VIDEO_CLIP = 'VIDEO_CLIP',
}

export interface Tv2VideoClipAction extends Tv2Action {
    metadata: {
        contentType: Tv2ActionContentType.VIDEO_CLIP,
        sourceName: string
    }
}

export interface Tv2CameraAction extends Tv2Action {
    metadata: {
        contentType: Tv2ActionContentType.CAMERA,
        cameraNumber: number
    }
}
