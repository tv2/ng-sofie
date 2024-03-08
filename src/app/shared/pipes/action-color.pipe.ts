import { Pipe, PipeTransform } from '@angular/core'
import { Tv2ActionContentType } from '../models/tv2-action'

@Pipe({
  name: 'actionColor',
})
export class ActionColorPipe implements PipeTransform {
  public transform(value: Tv2ActionContentType): string {
    switch (value) {
      case Tv2ActionContentType.CAMERA: {
        return 'camera-color'
      }
      case Tv2ActionContentType.VIDEO_CLIP: {
        return 'video-clip-color'
      }
      case Tv2ActionContentType.REPLAY: {
        return 'replay-color'
      }
      case Tv2ActionContentType.SPLIT_SCREEN: {
        return 'split-screen-color'
      }
      case Tv2ActionContentType.GRAPHICS: {
        return 'graphics-color'
      }
      case Tv2ActionContentType.REMOTE: {
        return 'remote-color'
      }
      case Tv2ActionContentType.AUDIO:
      case Tv2ActionContentType.ROBOT:
      case Tv2ActionContentType.TRANSITION:
      case Tv2ActionContentType.UNKNOWN:
      default: {
        return ''
      }
    }
  }
}
