import { Injectable } from '@angular/core'
import { Keys } from '../../keyboard/value-objects/key-binding'
import { StyledKeyBinding } from '../../keyboard/value-objects/styled-key-binding'
import { ActionService } from '../../shared/abstractions/action.service'
import { Tv2CameraAction, Tv2RemoteAction, Tv2TransitionAction } from '../../shared/models/tv2-action'
import { PartActionType } from '../../shared/models/action-type'
import { RundownService } from '../../core/abstractions/rundown.service'
import { Rundown } from '../../core/models/rundown'
import { DialogService } from '../../shared/services/dialog.service'
import { DialogSeverity } from '../../shared/components/confirmation-dialog/confirmation-dialog.component'
import { RundownNavigationService } from '../../shared/services/rundown-navigation.service'
import { RundownCursor } from '../../core/models/rundown-cursor'
import { Logger } from '../../core/abstractions/logger.service'

const CAMERA_COLOR: string = '#005919'
const REMOTE_COLOR: string = '#ac29a5'

const FUNCTION_KEY_PREFIX: string = 'F'
const DIGIT_KEY_PREFIX: string = 'Digit'

@Injectable()
export class KeyBindingFactory {
  private readonly logger: Logger

  constructor(
    private readonly actionService: ActionService,
    private readonly rundownService: RundownService,
    private readonly dialogService: DialogService,
    private readonly rundownNavigationService: RundownNavigationService,
    logger: Logger
  ) {
    this.logger = logger.tag('KeyBindingFactory')
  }

  public createCameraKeyBindingsFromActions(cameraActions: Tv2CameraAction[], rundownId: string): StyledKeyBinding[] {
    return cameraActions.map(cameraAction => this.createCameraKeyBindingFromAction(cameraAction, rundownId))
  }

  private createCameraKeyBindingFromAction(cameraAction: Tv2CameraAction, rundownId: string): StyledKeyBinding {
    if (cameraAction.type === PartActionType.INSERT_PART_AS_ON_AIR) {
      return this.createInsertCameraOnAirKeyBinding(cameraAction, rundownId)
    }
    return this.createInsertCameraAsNextKeyBinding(cameraAction, rundownId)
  }

  private createInsertCameraOnAirKeyBinding(cameraAction: Tv2CameraAction, rundownId: string): StyledKeyBinding {
    const cameraNumber: number = parseInt(cameraAction.metadata.cameraNumber)
    if (Number.isNaN(cameraNumber)) {
      throw new Error('Expected camera number to be an integer.')
    }
    return {
      keys: [`${FUNCTION_KEY_PREFIX}${cameraNumber}`],
      label: cameraAction.name,
      onMatched: () => this.actionService.executeAction(cameraAction.id, rundownId).subscribe(),
      shouldMatchOnKeyRelease: true,
      shouldPreventDefaultBehaviourOnKeyPress: true,
      shouldPreventDefaultBehaviourForPartialMatches: true,
      useExclusiveMatching: true,
      useOrderedMatching: false,
      background: CAMERA_COLOR,
    }
  }

  private createInsertCameraAsNextKeyBinding(cameraAction: Tv2CameraAction, rundownId: string): StyledKeyBinding {
    const cameraNumber: number = parseInt(cameraAction.metadata.cameraNumber)
    if (Number.isNaN(cameraNumber)) {
      throw new Error('Expected camera number to be an integer.')
    }
    return {
      keys: ['Alt', `${FUNCTION_KEY_PREFIX}${cameraNumber}`],
      label: cameraAction.name,
      onMatched: () => this.actionService.executeAction(cameraAction.id, rundownId).subscribe(),
      shouldMatchOnKeyRelease: true,
      shouldPreventDefaultBehaviourOnKeyPress: true,
      shouldPreventDefaultBehaviourForPartialMatches: true,
      useExclusiveMatching: true,
      useOrderedMatching: false,
      background: CAMERA_COLOR,
    }
  }

  public createRemoteKeyBindingsFromActions(remoteActions: Tv2RemoteAction[], rundownId: string): StyledKeyBinding[] {
    return remoteActions
      .filter(remoteAction => remoteAction.type === PartActionType.INSERT_PART_AS_NEXT && remoteAction.metadata.remoteNumber)
      .map(remoteAction => this.createInsertRemoteAsNextKeyBinding(remoteAction, rundownId))
  }

  private createInsertRemoteAsNextKeyBinding(remoteAction: Tv2RemoteAction, rundownId: string): StyledKeyBinding {
    const remoteNumber: number = parseInt(remoteAction.metadata.remoteNumber)
    if (Number.isNaN(remoteNumber)) {
      throw new Error('Expected remote number to be an integer.')
    }
    const keyDigit: number = remoteNumber !== 10 ? remoteNumber : 0
    return {
      keys: [`${DIGIT_KEY_PREFIX}${keyDigit}`],
      label: remoteAction.name,
      onMatched: () => this.actionService.executeAction(remoteAction.id, rundownId).subscribe(),
      shouldMatchOnKeyRelease: true,
      shouldPreventDefaultBehaviourOnKeyPress: true,
      shouldPreventDefaultBehaviourForPartialMatches: true,
      useExclusiveMatching: true,
      useOrderedMatching: false,
      background: REMOTE_COLOR,
    }
  }

  public createRundownKeyBindings(rundown: Rundown): StyledKeyBinding[] {
    if (rundown.isActive) {
      return [
        this.createRundownKeyBinding('Take', ['AnyEnter'], () => this.takeNext(rundown)),
        this.createRundownKeyBinding('Reset Rundown', ['Escape'], () => this.resetRundown(rundown)),
        this.createRundownKeyBinding('Deactivate Rundown', ['Control', 'Shift', 'Backquote'], () => this.deactivateRundown(rundown)),
        this.createRundownKeyBinding('Set Segment Above as Next', ['Shift', 'ArrowUp'], () => this.setSegmentAboveNextAsNext(rundown)),
        this.createRundownKeyBinding('Set Segment Below as Next', ['Shift', 'ArrowDown'], () => this.setSegmentBelowNextAsNext(rundown)),
        this.createRundownKeyBinding('Set Earlier Part as Next', ['Shift', 'ArrowLeft'], () => this.setEarlierPartAsNext(rundown)),
        this.createRundownKeyBinding('Set Later Part as Next', ['Shift', 'ArrowRight'], () => this.setLaterPartAsNext(rundown)),
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
    this.dialogService.createConfirmDialog(rundown.name, 'Are you sure you want to reset the Rundown?', 'Reset', () => this.rundownService.reset(rundown.id).subscribe())
  }

  private activateRundown(rundown: Rundown): void {
    if (rundown.isActive) {
      return
    }
    this.dialogService.createConfirmDialog(rundown.name, 'Are you sure you want to activate the Rundown?', 'Activate', () => this.rundownService.activate(rundown.id).subscribe())
  }

  private deactivateRundown(rundown: Rundown): void {
    if (!rundown.isActive) {
      return
    }
    this.dialogService.createConfirmDialog(
      rundown.name,
      'Are you sure you want to deactivate the Rundown?\n\nThis will clear the outputs.',
      'Deactivate',
      () => this.rundownService.deactivate(rundown.id).subscribe(),
      DialogSeverity.DANGER
    )
  }

  private setSegmentAboveNextAsNext(rundown: Rundown): void {
    try {
      const cursor: RundownCursor = this.rundownNavigationService.getRundownCursorForNearestValidSegmentBeforeSegmentMarkedAsNext(rundown)
      this.rundownService.setNext(rundown.id, cursor.segmentId, cursor.partId).subscribe()
    } catch (error) {
      this.logger.data(error).warn('Failed setting segment above as next.')
    }
  }

  private setSegmentBelowNextAsNext(rundown: Rundown): void {
    if (!rundown.isActive) {
      return
    }
    try {
      const cursor: RundownCursor = this.rundownNavigationService.getRundownCursorForNearestValidSegmentAfterSegmentMarkedAsNext(rundown)
      this.rundownService.setNext(rundown.id, cursor.segmentId, cursor.partId).subscribe()
    } catch (error) {
      this.logger.data(error).warn('Failed setting segment below as next.')
    }
  }

  private setEarlierPartAsNext(rundown: Rundown): void {
    if (!rundown.isActive) {
      return
    }
    try {
      const cursor: RundownCursor = this.rundownNavigationService.getRundownCursorForNearestValidPartBeforePartMarkedAsNext(rundown)
      this.rundownService.setNext(rundown.id, cursor.segmentId, cursor.partId).subscribe()
    } catch (error) {
      this.logger.data(error).warn('Failed setting a earlier part as next.')
    }
  }

  private setLaterPartAsNext(rundown: Rundown): void {
    if (!rundown.isActive) {
      return
    }
    try {
      const cursor: RundownCursor = this.rundownNavigationService.getRundownCursorForNearestValidPartAfterPartMarkedAsNext(rundown)
      this.rundownService.setNext(rundown.id, cursor.segmentId, cursor.partId).subscribe()
    } catch (error) {
      this.logger.data(error).warn('Failed setting a later part as next.')
    }
  }

  public createRundownKeyBinding(label: string, keys: Keys, onMatched: () => void): StyledKeyBinding {
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

  public createTransitionKeyBindingsFromActions(transitionActions: Tv2TransitionAction[], rundownId: string): StyledKeyBinding[] {
    const keys: [string, ...string[]][] = [['KeyZ'], ['KeyX'], ['KeyC'], ['KeyV'], ['KeyB']]
    return transitionActions.slice(0, 5).map((action, actionIndex) => this.createTransitionKeyBinding(action, rundownId, keys[actionIndex]))
  }

  private createTransitionKeyBinding(action: Tv2TransitionAction, rundownId: string, keys: [string, ...string[]]): StyledKeyBinding {
    return {
      keys,
      label: action.name,
      onMatched: () => this.actionService.executeAction(action.id, rundownId).subscribe(),
      shouldMatchOnKeyRelease: true,
      shouldPreventDefaultBehaviourForPartialMatches: true,
      shouldPreventDefaultBehaviourOnKeyPress: true,
      useExclusiveMatching: true,
      useOrderedMatching: false,
    }
  }
}
