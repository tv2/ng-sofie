import { Injectable } from '@angular/core'
import { KeyBinding } from '../../keyboard/models/key-binding'
import { ActionService } from '../../shared/abstractions/action.service'
import { Tv2CameraAction } from '../../shared/models/tv2-action'
import { PartActionType } from '../../shared/models/action-type'
import { RundownService } from '../../core/abstractions/rundown.service'
import { Rundown } from '../../core/models/rundown'
import { DialogService } from '../../shared/services/dialog.service'
import { RundownNavigationService } from '../../shared/services/rundown-navigation-service'
import { RundownCursor } from '../../core/models/rundown-cursor'

@Injectable()
export class KeyBindingFactory {
  constructor(
    private readonly actionService: ActionService,
    private readonly rundownService: RundownService,
    private readonly dialogService: DialogService,
    private readonly rundownNavigationService: RundownNavigationService
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

  public createRundownKeyBindings(rundown: Rundown): KeyBinding[] {
    if (rundown.isActive) {
      return [
        this.createRundownKeyBinding('Take', ['Enter'], () => this.takeNext(rundown)),
        this.createRundownKeyBinding('Reset Rundown', ['Escape'], () => this.resetRundown(rundown)),
        this.createRundownKeyBinding('Deactivate Rundown', ['ControlLeft', 'ShiftLeft', 'Backquote'], () => this.deactivateRundown(rundown)),
        this.createRundownKeyBinding('Set Segment Above as Next', ['ShiftLeft', 'ArrowUp'], () => this.setSegmentAboveNextAsNext(rundown)),
        this.createRundownKeyBinding('Set Segment Below as Next', ['ShiftLeft', 'ArrowDown'], () => this.setSegmentBelowNextAsNext(rundown)),
        this.createRundownKeyBinding('Set Earlier Part as Next', ['ShiftLeft', 'ArrowLeft'], () => this.setEarlierPartAsNext(rundown)),
        this.createRundownKeyBinding('Set Later Part as Next', ['ShiftLeft', 'ArrowRight'], () => this.setLaterPartAsNext(rundown)),
      ]
    }
    return [
      this.createRundownKeyBinding('Activate Rundown', ['Backquote'], () => this.activateRundown(rundown)),
      this.createRundownKeyBinding('Reset Rundown', ['Escape'], () => this.resetRundown(rundown)),
    ]
  }

  private takeNext(rundown: Rundown): void {
    if (!rundown.isActive) {
      return
    }
    this.rundownService.takeNext(rundown.id).subscribe()
  }

  private resetRundown(rundown: Rundown): void {
    this.dialogService.createConfirmDialog(rundown.name, `Are you sure you want to reset the Rundown?`, 'Reset', () => this.rundownService.reset(rundown.id).subscribe())
  }

  private activateRundown(rundown: Rundown): void {
    if (rundown.isActive) {
      return
    }
    this.dialogService.createConfirmDialog(rundown.name, `Are you sure you want to activate the Rundown?`, 'Activate', () => this.rundownService.activate(rundown.id).subscribe())
  }

  private deactivateRundown(rundown: Rundown): void {
    if (!rundown.isActive) {
      return
    }
    this.dialogService.createConfirmDialog(rundown.name, `Are you sure you want to deactivate the Rundown?`, 'Deactivate', () => this.rundownService.deactivate(rundown.id).subscribe())
  }

  private setSegmentAboveNextAsNext(rundown: Rundown): void {
    if (!rundown.isActive) {
      return
    }
    const cursor: RundownCursor = this.rundownNavigationService.getCursorForSegmentAboveNext(rundown)
    this.rundownService.setNext(rundown.id, cursor.segmentId, cursor.partId).subscribe()
  }

  private setSegmentBelowNextAsNext(rundown: Rundown): void {
    if (!rundown.isActive) {
      return
    }
    const cursor: RundownCursor = this.rundownNavigationService.getCursorForSegmentBelowNext(rundown)
    this.rundownService.setNext(rundown.id, cursor.segmentId, cursor.partId).subscribe()
  }

  private setEarlierPartAsNext(rundown: Rundown): void {
    if (!rundown.isActive) {
      return
    }
    const cursor: RundownCursor = this.rundownNavigationService.getCursorForEarlierPart(rundown)
    this.rundownService.setNext(rundown.id, cursor.segmentId, cursor.partId).subscribe()
  }

  private setLaterPartAsNext(rundown: Rundown): void {
    if (!rundown.isActive) {
      return
    }
    const cursor: RundownCursor = this.rundownNavigationService.getCursorForLaterPart(rundown)
    this.rundownService.setNext(rundown.id, cursor.segmentId, cursor.partId).subscribe()
  }

  public createRundownKeyBinding(label: string, keys: [string, ...string[]], onMatched: () => void): KeyBinding {
    return {
      keys,
      label,
      onMatched,
      shouldMatchOnKeyRelease: true,
      shouldPreventDefaultBehaviourForPartialMatches: true,
      shouldPreventDefaultBehaviourOnKeyPress: true,
      useExclusiveMatching: true,
      useOrderedMatching: false,
    }
  }
}
