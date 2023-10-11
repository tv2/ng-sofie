import { Injectable } from '@angular/core'
import { KeyBinding } from '../../keyboard/models/key-binding'
import { ActionService } from '../../shared/abstractions/action.service'

@Injectable()
export class CameraKeyBindingFactory {
  constructor(private readonly actionService: ActionService) {}

  public createCameraKeyBindings(numberOfCameras: number, rundownId: string): KeyBinding[] {
    return Array(numberOfCameras)
      .fill(null)
      .flatMap((_, index) => [this.createInsertCameraOnAirKeyBindings(index + 1, rundownId), this.createInsertCameraAsNextKeyBindings(index + 1, rundownId)])
  }

  private createInsertCameraOnAirKeyBindings(cameraNumber: number, rundownId: string): KeyBinding {
    return {
      keys: [`Digit${cameraNumber}`],
      label: `KAM ${cameraNumber}`,
      onMatched: () => this.actionService.executeAction(this.getInsertCameraOnAirActionId(cameraNumber), rundownId).subscribe(),
      shouldMatchOnKeyRelease: true,
      shouldPreventDefaultBehaviourOnKeyPress: true,
      shouldPreventDefaultBehaviourForPartialMatches: true,
      useExclusiveMatching: true,
      useOrderedMatching: false,
    }
  }

  private getInsertCameraOnAirActionId(cameraNumber: number): string {
    return `cameraAsOnAirAction_${cameraNumber - 1}`
  }

  private createInsertCameraAsNextKeyBindings(cameraNumber: number, rundownId: string): KeyBinding {
    return {
      keys: ['AltLeft', `Digit${cameraNumber}`],
      label: `KAM ${cameraNumber}`,
      onMatched: () => this.actionService.executeAction(this.getInsertCameraAsNextActionId(cameraNumber), rundownId).subscribe(),
      shouldMatchOnKeyRelease: true,
      shouldPreventDefaultBehaviourOnKeyPress: true,
      shouldPreventDefaultBehaviourForPartialMatches: true,
      useExclusiveMatching: true,
      useOrderedMatching: false,
    }
  }

  private getInsertCameraAsNextActionId(cameraNumber: number): string {
    return `cameraAsNextAction_${cameraNumber - 1}`
  }
}
