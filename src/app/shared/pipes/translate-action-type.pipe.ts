import { Pipe, PipeTransform } from '@angular/core'
import { Tv2ActionContentType } from '../models/tv2-action'

@Pipe({
  name: 'translateActionType',
})
export class TranslateActionTypePipe implements PipeTransform {
  public transform(value: Tv2ActionContentType): string {
    switch (value) {
      case Tv2ActionContentType.AUDIO:
        return $localize`global.audio.label`
      case Tv2ActionContentType.REMOTE:
        return $localize`global.remote.label`
      case Tv2ActionContentType.CAMERA:
        return $localize`global.camera.label`
      case Tv2ActionContentType.GRAPHICS:
        return $localize`global.graphics.label`
      case Tv2ActionContentType.REPLAY:
        return $localize`global.replay.label`
      case Tv2ActionContentType.ROBOT:
        return $localize`global.robot.label`
      case Tv2ActionContentType.SPLIT_SCREEN:
        return $localize`global.split-screen.label`
      case Tv2ActionContentType.TRANSITION:
        return $localize`global.transition.label`
      case Tv2ActionContentType.UNKNOWN:
        return $localize`global.unknown.label`
      case Tv2ActionContentType.VIDEO_CLIP:
        return $localize`global.video-clip.label`
      default:
        return value
    }
  }
}
