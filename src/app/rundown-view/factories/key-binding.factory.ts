import { Injectable } from '@angular/core'
import { KeyBinding } from '../../keyboard/models/key-binding'
import { ActionService } from '../../shared/abstractions/action.service'
import { Tv2CameraAction } from '../../shared/models/tv2-action'
import { PartActionType } from '../../shared/models/action-type'
import { RundownService } from '../../core/abstractions/rundown.service'

@Injectable()
export class KeyBindingFactory {
  constructor(
    private readonly actionService: ActionService,
    private readonly rundownService: RundownService
  ) {}

  public createCameraKeyBindingsFromActions(cameraActions: Tv2CameraAction[], rundownId: string): KeyBinding[] {
    return cameraActions.map(cameraAction => this.createCameraKeyBindingFromAction(cameraAction, rundownId))
  }

  private createCameraKeyBindingFromAction(cameraAction: Tv2CameraAction, rundownId: string): KeyBinding {
    if (cameraAction.type === PartActionType.INSERT_PART_AS_ON_AIR) {
      return this.createInsertCameraOnAirKeyBinding(cameraAction, rundownId)
    }
    return this.createInsertCameraAsNextKeyBinding(cameraAction, rundownId)
  }

  private createInsertCameraOnAirKeyBinding(cameraAction: Tv2CameraAction, rundownId: string): KeyBinding {
    const cameraNumber: number = cameraAction.metadata.cameraNumber
    return {
      keys: [`Digit${cameraNumber}`],
      label: cameraAction.name,
      onMatched: () => this.actionService.executeAction(cameraAction.id, rundownId).subscribe(),
      shouldMatchOnKeyRelease: true,
      shouldPreventDefaultBehaviourOnKeyPress: true,
      shouldPreventDefaultBehaviourForPartialMatches: true,
      useExclusiveMatching: true,
      useOrderedMatching: false,
    }
  }

  private createInsertCameraAsNextKeyBinding(cameraAction: Tv2CameraAction, rundownId: string): KeyBinding {
    const cameraNumber: number = cameraAction.metadata.cameraNumber
    return {
      keys: ['AltLeft', `Digit${cameraNumber}`],
      label: `KAM ${cameraNumber}`,
      onMatched: () => this.actionService.executeAction(cameraAction.id, rundownId).subscribe(),
      shouldMatchOnKeyRelease: true,
      shouldPreventDefaultBehaviourOnKeyPress: true,
      shouldPreventDefaultBehaviourForPartialMatches: true,
      useExclusiveMatching: true,
      useOrderedMatching: false,
    }
  }

  public createRundownKeyBindings(rundownId: string): KeyBinding[] {
    return [
      this.createRundownKeyBinding('Take', ['Enter'], () => this.rundownService.takeNext(rundownId).subscribe()),
      this.createRundownKeyBinding('Reset Rundown', ['Escape'], () => this.rundownService.reset(rundownId).subscribe()),
      this.createRundownKeyBinding('Activate Rundown', ['Backquote'], () => this.rundownService.activate(rundownId).subscribe()),
      this.createRundownKeyBinding('Activate Rundown', ['ShiftLeft', 'Backquote'], () => this.rundownService.deactivate(rundownId).subscribe()),
    ]
  }

  public createRundownKeyBinding(label: string, keys: [string, ...string[]], onMatched: () => void): KeyBinding {
    return {
      keys,
      label,
      onMatched,
      shouldMatchOnKeyRelease: true,
      shouldPreventDefaultBehaviourForPartialMatches: false,
      shouldPreventDefaultBehaviourOnKeyPress: false,
      useExclusiveMatching: false,
      useOrderedMatching: false,
    }
  }
}
