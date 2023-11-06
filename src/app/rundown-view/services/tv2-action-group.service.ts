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
    switch (action.metadata.contentType) {
      case Tv2ActionContentType.CAMERA:
        grouping.camera.push(action as Tv2CameraAction)
        break
      case Tv2ActionContentType.REMOTE:
        grouping.remote.push(action as Tv2RemoteAction)
        break
      case Tv2ActionContentType.VIDEO_CLIP:
        grouping.videoClip.push(action as Tv2VideoClipAction)
        break
      case Tv2ActionContentType.TRANSITION:
        grouping.transition.push(action as Tv2TransitionAction)
    }
    return grouping
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
