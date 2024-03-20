import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { RundownService } from '../../../core/abstractions/rundown.service'
import { Rundown } from '../../../core/models/rundown'
import { DialogService } from '../../../shared/services/dialog.service'
import { ContextMenuOption } from '../../../shared/abstractions/context-menu-option'
import { DialogSeverity } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component'
import { RundownMode } from '../../../core/enums/rundown-mode'
import { BasicRundownStateService } from '../../../core/services/basic-rundown-state.service'
import { BasicRundown } from '../../../core/models/basic-rundown'

@Component({
  selector: 'sofie-rundown-header-context-menu',
  templateUrl: './rundown-header-context-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RundownHeaderContextMenuComponent {
  @Input()
  public rundown: Rundown

  @Input()
  public shortenedRundownName: string

  private readonly contextMenuOptionsForInactiveRundown: ContextMenuOption[] = [
    {
      label: 'Activate (On Air)',
      contextAction: (): void => this.switchActivateRundownDialog(),
    },
    {
      label: 'Rehearse',
      contextAction: (): void => this.switchRehearsalRundownDialog(),
    },
    {
      label: 'Reingest data',
      contextAction: (): void => this.reingestData(),
    },
  ]

  private readonly contextMenuOptionsForActiveRundown: ContextMenuOption[] = [
    {
      label: 'Deactivate',
      contextAction: (): void => this.openDeactivateRundownDialog(),
    },
    {
      label: 'Take',
      contextAction: (): void => this.take(),
    },
    {
      label: 'Reset Rundown',
      contextAction: (): void => this.openResetRundownDialog(),
    },
    {
      label: 'Reingest data',
      contextAction: (): void => this.reingestData(),
    },
  ]

  private readonly contextMenuOptionsForRehearseRundown: ContextMenuOption[] = [
    {
      label: 'Activate (On Air)',
      contextAction: (): void => this.switchActivateRundownDialog(),
    },
    ...this.contextMenuOptionsForActiveRundown,
  ]

  public get contextMenuOptions(): ContextMenuOption[] {
    switch (this.rundown.mode) {
      case RundownMode.ACTIVE:
        return this.contextMenuOptionsForActiveRundown
      case RundownMode.REHEARSAL:
        return this.contextMenuOptionsForRehearseRundown
      default:
        return this.contextMenuOptionsForInactiveRundown
    }
  }

  constructor(
    private readonly basicRundownStateService: BasicRundownStateService,
    private readonly rundownService: RundownService,
    private readonly dialogService: DialogService
  ) {}

  public switchActivateRundownDialog(): void {
    const nonIdleRundown: BasicRundown | undefined = this.basicRundownStateService.getNonIdleRundown()
    if (!nonIdleRundown) {
      this.dialogService.createConfirmDialog(this.rundown.name, 'Are you sure you want to activate the Rundown?', 'Activate', () => this.activateRundown())
      return
    }
    switch (true) {
      case nonIdleRundown.mode === RundownMode.REHEARSAL && nonIdleRundown.id === this.rundown.id:
        this.rundownService.activate(nonIdleRundown.id).subscribe()
        return
      case nonIdleRundown.mode === RundownMode.ACTIVE && nonIdleRundown.id !== this.rundown.id:
        this.dialogService.createConfirmDialog(this.rundown.name, `Are you sure you want to activate the Rundown?\n\nThis will deactivate the Rundown "${nonIdleRundown.name}"`, 'Activate', () =>
          this.rundownService.deactivate(nonIdleRundown.id).subscribe(() => this.activateRundown())
        )
        return
      case nonIdleRundown.mode === RundownMode.REHEARSAL && nonIdleRundown.id !== this.rundown.id:
        this.rundownService.deactivate(nonIdleRundown.id).subscribe(() => this.activateRundown())
        return
    }
  }

  public activateRundown(): void {
    this.rundownService.activate(this.rundown.id).subscribe()
  }

  public rehearseRundown(): void {
    this.rundownService.rehearse(this.rundown.id).subscribe()
  }

  public openDeactivateRundownDialog(): void {
    this.dialogService.createConfirmDialog(
      this.rundown.name,
      'Are you sure you want to deactivate the Rundown?\n\nThis will clear the outputs.',
      'Deactivate',
      () => this.deactivateRundown(),
      DialogSeverity.DANGER
    )
  }

  private deactivateRundown(): void {
    this.rundownService.deactivate(this.rundown.id).subscribe()
  }

  private take(): void {
    this.rundownService.takeNext(this.rundown.id).subscribe()
  }

  public openResetRundownDialog(): void {
    this.dialogService.createConfirmDialog(this.rundown.name, 'Are you sure you want to reset the Rundown?', 'Reset', () => this.resetRundown())
  }

  private resetRundown(): void {
    this.rundownService.reset(this.rundown.id).subscribe()
  }

  public reingestData(): void {
    this.rundownService.reingest(this.rundown.id).subscribe()
  }

  private switchRehearsalRundownDialog(): void {
    const nonIdleRundown: BasicRundown | undefined = this.basicRundownStateService.getNonIdleRundown()
    if (!nonIdleRundown) {
      this.dialogService.createConfirmDialog(this.rundown.name, 'Are you sure you want to rehearse the Rundown?', 'Rehearse', () => this.rehearseRundown())
      return
    }
    switch (true) {
      case nonIdleRundown.mode === RundownMode.ACTIVE && nonIdleRundown.id === this.rundown.id:
        this.dialogService.createConfirmDialog(this.rundown.name, `Are you sure you want to rehearse the active Rundown?`, 'Rehearse', () => this.rehearseRundown())
        return
      case nonIdleRundown.mode === RundownMode.REHEARSAL && nonIdleRundown.id !== this.rundown.id:
        this.rundownService.deactivate(nonIdleRundown.id).subscribe(() => this.rehearseRundown())
        return
      case nonIdleRundown.mode === RundownMode.ACTIVE && nonIdleRundown.id !== this.rundown.id:
        this.dialogService.createConfirmDialog(this.rundown.name, `Are you sure you want to rehearse the Rundown?\n\nThis will deactivate the Rundown "${nonIdleRundown.name}"`, 'Rehearse', () =>
          this.rundownService.deactivate(nonIdleRundown.id).subscribe(() => this.rehearseRundown())
        )
        return
    }
  }
}
