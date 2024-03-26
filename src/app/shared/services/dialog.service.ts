import { ComponentType } from '@angular/cdk/overlay'
import { Injectable } from '@angular/core'
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog'
import { ConfirmationDialogComponent, DialogColorScheme, DialogSeverity } from '../components/confirmation-dialog/confirmation-dialog.component'
import { StronglyTypedDialog } from '../directives/strongly-typed-dialog.directive'
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

  public createConfirmDialog(
    title: string,
    message: string,
    okButtonText: string,
    onOk: () => void,
    theme: DialogColorScheme = DialogColorScheme.DARK,
    severity: DialogSeverity = DialogSeverity.INFO
  ): void {
    this.open(ConfirmationDialogComponent, {
      data: {
        title: title,
        message: message,
        buttonText: {
          ok: okButtonText,
          cancel: $localize`dialog.cancel-button:Cancel`,
        },
        theme,
        severity,
      },
    })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          onOk()
        }
      })
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
