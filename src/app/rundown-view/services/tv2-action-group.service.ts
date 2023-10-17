import { Tv2Action, Tv2ActionContentType, Tv2CameraAction, Tv2VideoClipAction } from '../../shared/models/tv2-action'

export interface Tv2ActionContentTypeGrouping {
  camera: Tv2CameraAction[]
  videoClip: Tv2VideoClipAction[]
}

export class Tv2ActionGroupService {
  public getActionsGroupedByContentType(actions: Tv2Action[]): Tv2ActionContentTypeGrouping {
    return actions.reduce(this.groupActionsByContentTypeReducer.bind(this), this.getEmptyGrouping())
  }

  private groupActionsByContentTypeReducer(grouping: Tv2ActionContentTypeGrouping, action: Tv2Action): Tv2ActionContentTypeGrouping {
    if (this.isCameraAction(action)) {
      grouping.camera.push(action)
    } else if (this.isVideoClipAction(action)) {
      grouping.videoClip.push(action)
    }
    return grouping
  }

  private isCameraAction(action: Tv2Action): action is Tv2CameraAction {
    return action.metadata.contentType === Tv2ActionContentType.CAMERA
  }

  private isVideoClipAction(action: Tv2Action): action is Tv2VideoClipAction {
    return action.metadata.contentType === Tv2ActionContentType.VIDEO_CLIP
  }

  public getEmptyGrouping(): Tv2ActionContentTypeGrouping {
    return {
      camera: [],
      videoClip: [],
    }
  }
}
