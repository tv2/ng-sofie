import { KeyBinding } from '../models/key-binding'
import { Injectable } from '@angular/core'
import { Logger } from '../../core/abstractions/logger.service'

@Injectable()
export class CameraKeyBindingFactory {
  private readonly logger: Logger

  public createCameraKeyBindings(numberOfCameras: number): KeyBinding[] {
    return Array(numberOfCameras)
      .fill(null)
      .map((_, index) => {
        const cameraNumber: number = index + 1
        const label = `KAM ${cameraNumber}`
        return {
          key: cameraNumber.toString(),
          modifiers: [],
          label,
          action: () => this.logger.error(label),
          onKeyPress: false,
        }
      })
  }
}
