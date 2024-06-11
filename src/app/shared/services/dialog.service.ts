import { ComponentType } from '@angular/cdk/overlay'
import { Injectable } from '@angular/core'
import { LegacyDialogPosition as DialogPosition, MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog'
import { ConfirmationDialogComponent, DialogColorScheme, DialogSeverity } from '../components/confirmation-dialog/confirmation-dialog.component'
import { StronglyTypedDialog } from '../directives/strongly-typed-dialog.directive'

const STANDARD_DIALOG_HEIGHT: number = 183 // This is the height of our ConfirmDialog at the time of writing.

@Injectable()
export class DialogService {
  constructor(public dialog: MatDialog) {}

  private open<DialogData, DialogResult>(
    component: ComponentType<StronglyTypedDialog<DialogData, DialogResult>>,
    config: MatDialogConfig<DialogData> = {}
  ): MatDialogRef<StronglyTypedDialog<DialogData, DialogResult>, DialogResult> {
    config.position = this.getDialogPositionConfig()

    return this.dialog.open(component, config)
  }

  private getDialogPositionConfig(): DialogPosition {
    const isWindowHeightLargerThanCurrentScreenHeight: boolean = window.innerHeight > window.screen.availHeight
    if (!isWindowHeightLargerThanCurrentScreenHeight) {
      return {}
    }
    const top: string = `${window.screen.availHeight / 2 - STANDARD_DIALOG_HEIGHT}px`
    return {
      top,
    }
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
  public openSidebarDialog<T extends { new (arg: D, ...args: any): object }, D = undefined, R = undefined>(component: T, onClose: (result?: R) => void, data?: D): void {
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
