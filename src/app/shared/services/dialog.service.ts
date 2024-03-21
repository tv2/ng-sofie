import { ComponentType } from '@angular/cdk/overlay'
import { Injectable } from '@angular/core'
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog'
import { ConfirmationDialogComponent, DialogSeverity } from '../components/confirmation-dialog/confirmation-dialog.component'
import { StronglyTypedDialog } from '../directives/strongly-typed-dialog.directive'
import { Rundown } from '../../core/models/rundown'
import { RundownMode } from '../../core/enums/rundown-mode'
import { BasicRundown } from '../../core/models/basic-rundown'
import { BasicRundownStateService } from '../../core/services/basic-rundown-state.service'
import { RundownService } from '../../core/abstractions/rundown.service'

@Injectable()
export class DialogService {
  constructor(
    public dialog: MatDialog,
    private readonly basicRundownStateService: BasicRundownStateService,
    private readonly rundownService: RundownService
  ) {}

  private open<DialogData, DialogResult>(
    component: ComponentType<StronglyTypedDialog<DialogData, DialogResult>>,
    config?: MatDialogConfig<DialogData>
  ): MatDialogRef<StronglyTypedDialog<DialogData, DialogResult>, DialogResult> {
    return this.dialog.open(component, config)
  }

  public createConfirmDialog(title: string, message: string, okButtonText: string, onOk: () => void, severity?: DialogSeverity): void {
    this.open(ConfirmationDialogComponent, {
      data: {
        title: title,
        message: message,
        buttonText: {
          ok: okButtonText,
          cancel: $localize`dialog.cancel-button:Cancel`,
        },
        severity,
      },
    })
      .afterClosed()
      .subscribe(result => {
        if (!result) {
          return
        }
        onOk()
      })
  }

  public switchActivateRundownDialog(rundown: Rundown): void {
    if (rundown.mode === RundownMode.ACTIVE) {
      return
    }

    const nonIdleRundown: BasicRundown | undefined = this.basicRundownStateService.getNonIdleRundown()
    if (!nonIdleRundown) {
      this.rundownService.activate(rundown.id).subscribe()
      return
    }

    switch (true) {
      case nonIdleRundown.mode === RundownMode.REHEARSAL && nonIdleRundown.id === rundown.id:
        this.rundownService.activate(nonIdleRundown.id).subscribe()
        return

      case nonIdleRundown.mode === RundownMode.ACTIVE && nonIdleRundown.id !== rundown.id:
        this.createConfirmDialog(rundown.name, `Are you sure you want to activate the Rundown?\n\nThis will deactivate the Rundown "${nonIdleRundown.name}"`, 'Activate', () =>
          this.rundownService.deactivate(nonIdleRundown.id).subscribe(() => this.rundownService.activate(rundown.id).subscribe())
        )
        return

      case nonIdleRundown.mode === RundownMode.REHEARSAL && nonIdleRundown.id !== rundown.id:
        this.rundownService.deactivate(nonIdleRundown.id).subscribe(() => this.rundownService.activate(rundown.id).subscribe())
        return
    }
  }

  public switchRehearsalRundownDialog(rundown: Rundown): void {
    if (rundown.mode === RundownMode.REHEARSAL) {
      return
    }

    const nonIdleRundown: BasicRundown | undefined = this.basicRundownStateService.getNonIdleRundown()
    if (!nonIdleRundown) {
      this.rundownService.rehearse(rundown.id).subscribe()
      return
    }

    switch (true) {
      case nonIdleRundown.mode === RundownMode.ACTIVE && nonIdleRundown.id === rundown.id:
        this.createConfirmDialog(rundown.name, `Are you sure you want to rehearse the active Rundown?`, 'Rehearse', () => this.rundownService.rehearse(rundown.id).subscribe())
        return

      case nonIdleRundown.mode === RundownMode.REHEARSAL && nonIdleRundown.id !== rundown.id:
        this.rundownService.deactivate(nonIdleRundown.id).subscribe(() => this.rundownService.rehearse(rundown.id).subscribe())
        return

      case nonIdleRundown.mode === RundownMode.ACTIVE && nonIdleRundown.id !== rundown.id:
        this.createConfirmDialog(rundown.name, `Are you sure you want to rehearse the Rundown?\n\nThis will deactivate the Rundown "${nonIdleRundown.name}"`, 'Rehearse', () =>
          this.rundownService.deactivate(nonIdleRundown.id).subscribe(() => this.rundownService.rehearse(rundown.id).subscribe())
        )
        return
    }
  }
}
