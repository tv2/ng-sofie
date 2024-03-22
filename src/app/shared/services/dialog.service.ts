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
  private readonly activateOtherActiveMessage: string = $localize`Are you sure you want to activate the Rundown?\n\nThis will deactivate the Rundown`
  private readonly activateOkButtonText: string = $localize`Activate`
  private readonly rehearseSameActiveMessage: string = $localize`Are you sure you want to rehearse the active Rundown?`
  private readonly rehearseOkButtonText: string = $localize`Rehearse`
  private readonly rehearseOtherActiveMessage: string = $localize`Are you sure you want to rehearse the Rundown?\n\nThis will deactivate the Rundown`

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
        this.createConfirmDialog(rundown.name, `${this.activateOtherActiveMessage} "${nonIdleRundown.name}"`, `${this.activateOkButtonText}`, () =>
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
        this.createConfirmDialog(rundown.name, this.rehearseSameActiveMessage, this.rehearseOkButtonText, () => this.rundownService.rehearse(rundown.id).subscribe())
        return

      case nonIdleRundown.mode === RundownMode.REHEARSAL && nonIdleRundown.id !== rundown.id:
        this.rundownService.deactivate(nonIdleRundown.id).subscribe(() => this.rundownService.rehearse(rundown.id).subscribe())
        return

      case nonIdleRundown.mode === RundownMode.ACTIVE && nonIdleRundown.id !== rundown.id:
        this.createConfirmDialog(rundown.name, `${this.rehearseOtherActiveMessage} "${nonIdleRundown.name}"`, this.rehearseOkButtonText, () =>
          this.rundownService.deactivate(nonIdleRundown.id).subscribe(() => this.rundownService.rehearse(rundown.id).subscribe())
        )
        return
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public openSidebarDialog<T extends { new (arg: R, ...args: any): object }, R>(component: T, onClose: (result?: R) => void, data?: R): void {
    this.dialog
      .open(component, {
        data,
        position: { top: '0', right: '0' },
        height: '100%',
        enterAnimationDuration: '0ms',
        exitAnimationDuration: '0ms',
        panelClass: 'sidebar-dialog',
      })
      .afterClosed()
      .subscribe(result => onClose(result))
  }
}
