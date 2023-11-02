import { Tv2Action, Tv2ActionContentType, Tv2CameraAction, Tv2RemoteAction, Tv2TransitionAction, Tv2VideoClipAction } from '../../shared/models/tv2-action'

export interface Tv2ActionContentTypeGrouping {
  camera: Tv2CameraAction[]
  remote: Tv2RemoteAction[]
  videoClip: Tv2VideoClipAction[]
  transition: Tv2TransitionAction[]
}

export class Tv2ActionGroupService {
  public getActionsGroupedByContentType(actions: Tv2Action[]): Tv2ActionContentTypeGrouping {
    return actions.reduce(this.groupActionsByContentTypeReducer.bind(this), this.createEmptyGrouping())
  }

  private groupActionsByContentTypeReducer(grouping: Tv2ActionContentTypeGrouping, action: Tv2Action): Tv2ActionContentTypeGrouping {
    if (this.isCameraAction(action)) {
      grouping.camera.push(action)
    } else if (this.isRemoteAction(action)) {
      grouping.remote.push(action)
    } else if (this.isVideoClipAction(action)) {
      grouping.videoClip.push(action)
    } else if (this.isTransitionAction(action)) {
      grouping.transition.push(action)
    }
    return grouping
  }

  private isCameraAction(action: Tv2Action): action is Tv2CameraAction {
    return action.metadata.contentType === Tv2ActionContentType.CAMERA
  }

  private isRemoteAction(action: Tv2Action): action is Tv2RemoteAction {
    return action.metadata.contentType === Tv2ActionContentType.REMOTE
  }

  private isVideoClipAction(action: Tv2Action): action is Tv2VideoClipAction {
    return action.metadata.contentType === Tv2ActionContentType.VIDEO_CLIP
  }

  private isTransitionAction(action: Tv2Action): action is Tv2TransitionAction {
    return action.metadata.contentType === Tv2ActionContentType.TRANSITION
  }

  private createEmptyGrouping(): Tv2ActionContentTypeGrouping {
    return {
      camera: [],
      remote: [],
      videoClip: [],
      transition: [],
    }
  }
}
