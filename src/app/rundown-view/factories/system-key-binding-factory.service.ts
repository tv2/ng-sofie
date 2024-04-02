import { Injectable } from '@angular/core'
import { Keys } from '../../keyboard/value-objects/key-binding'
import { StyledKeyBinding } from '../../keyboard/value-objects/styled-key-binding'
import { RundownService } from '../../core/abstractions/rundown.service'
import { Rundown } from '../../core/models/rundown'
import { DialogService } from '../../shared/services/dialog.service'
import { DialogColorScheme, DialogSeverity } from '../../shared/components/confirmation-dialog/confirmation-dialog.component'
import { RundownNavigationService } from '../../shared/services/rundown-navigation.service'
import { RundownCursor } from '../../core/models/rundown-cursor'
import { Logger } from '../../core/abstractions/logger.service'
import { MiniShelfCycleService } from '../services/mini-shelf-cycle.service'
import { RundownMode } from '../../core/enums/rundown-mode'

@Injectable()
export class SystemKeyBindingFactory {
  private readonly logger: Logger

  constructor(
    private readonly rundownService: RundownService,
    private readonly dialogService: DialogService,
    private readonly rundownNavigationService: RundownNavigationService,
    private readonly miniShelfCycleService: MiniShelfCycleService,
    logger: Logger
  ) {
    this.logger = logger.tag('KeyBindingFactory')
  }

  public createActiveRundownKeyBindings(rundown: Rundown): StyledKeyBinding[] {
    return [
      this.createRundownKeyBinding('Take', ['AnyEnter'], () => this.takeNext(rundown)),
      this.createRundownKeyBinding('Reset Rundown', ['Escape'], () => this.resetRundown(rundown)),
      this.createRundownKeyBinding('Deactivate Rundown', ['Control', 'Shift', 'Backquote'], () => this.deactivateRundown(rundown)),
      this.createRundownKeyBinding('Set Segment Above as Next', ['Shift', 'ArrowUp'], () => this.setSegmentAboveNextAsNext(rundown)),
      this.createRundownKeyBinding('Set Segment Below as Next', ['Shift', 'ArrowDown'], () => this.setSegmentBelowNextAsNext(rundown)),
      this.createRundownKeyBinding('Set Earlier Part as Next', ['Shift', 'ArrowLeft'], () => this.setEarlierPartAsNext(rundown)),
      this.createRundownKeyBinding('Set Later Part as Next', ['Shift', 'ArrowRight'], () => this.setLaterPartAsNext(rundown)),
      this.createRundownKeyBinding('Cycle MiniShelf', ['Tab'], () => this.miniShelfCycleService.cycleMiniShelfForward(rundown)),
      this.createRundownKeyBinding('Cycle MiniShelf', ['Shift', 'Tab'], () => this.miniShelfCycleService.cycleMiniShelfBackward(rundown)),
    ]
  }

  public createRehearsalRundownKeyBindings(rundown: Rundown): StyledKeyBinding[] {
    return [...this.createActiveRundownKeyBindings(rundown), this.createRundownKeyBinding('Activate Rundown', ['Backquote'], () => this.activateRundown(rundown))]
  }

  public createInactiveRundownKeyBindings(rundown: Rundown): StyledKeyBinding[] {
    return [
      this.createRundownKeyBinding('Activate Rundown', ['Backquote'], () => this.activateRundown(rundown)),
      this.createRundownKeyBinding('Reset Rundown', ['Escape'], () => this.resetRundown(rundown)),
    ]
  }

  private takeNext(rundown: Rundown): void {
    if (rundown.mode === RundownMode.INACTIVE) {
      return
    }
    this.rundownService.takeNext(rundown.id).subscribe()
  }

  private resetRundown(rundown: Rundown): void {
    this.dialogService.createConfirmDialog(
      rundown.name,
      'Are you sure you want to reset the Rundown?',
      'Reset',
      () => this.rundownService.reset(rundown.id).subscribe(),
      DialogColorScheme.DARK,
      DialogSeverity.INFO
    )
  }

  private activateRundown(rundown: Rundown): void {
    if (rundown.mode === RundownMode.ACTIVE) {
      return
    }
    this.dialogService.createConfirmDialog(
      rundown.name,
      'Are you sure you want to activate the Rundown?',
      'Activate',
      () => this.rundownService.activate(rundown.id).subscribe(),
      DialogColorScheme.DARK,
      DialogSeverity.INFO
    )
  }

  private deactivateRundown(rundown: Rundown): void {
    if (rundown.mode === RundownMode.INACTIVE) {
      return
    }
    this.dialogService.createConfirmDialog(
      rundown.name,
      'Are you sure you want to deactivate the Rundown?\n\nThis will clear the outputs.',
      'Deactivate',
      () => this.rundownService.deactivate(rundown.id).subscribe(),
      DialogColorScheme.DARK,
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
    if (rundown.mode === RundownMode.INACTIVE) {
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
    if (rundown.mode === RundownMode.INACTIVE) {
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
    if (rundown.mode === RundownMode.INACTIVE) {
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
}
