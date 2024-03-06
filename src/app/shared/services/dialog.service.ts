import { ComponentType } from '@angular/cdk/overlay'
import { Injectable } from '@angular/core'
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog'
import { ConfirmationDialogComponent, DialogSeverity } from '../components/confirmation-dialog/confirmation-dialog.component'
import { StronglyTypedDialog } from '../directives/strongly-typed-dialog.directive'

@Injectable()
export class DialogService {
  constructor(public dialog: MatDialog) {}

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

  public openSidebarDialog<T, R>(component: ComponentType<T>, data: R, onClose: (result: R) => void): void {
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
