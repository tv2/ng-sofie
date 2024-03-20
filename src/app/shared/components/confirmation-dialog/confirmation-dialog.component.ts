import { Component, HostBinding, Inject } from '@angular/core'
import { StronglyTypedDialog } from '../../directives/strongly-typed-dialog.directive'
import { ThemePalette } from '@angular/material/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

export enum DialogSeverity {
  INFO = 'INFO',
  DANGER = 'DANGER',
}

export enum DialogColorTheme {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

export interface ConfirmationDialogData {
  title?: string
  message?: string
  buttonText?: {
    ok: string
    cancel?: string
  }
  severity?: DialogSeverity
  theme?: DialogColorTheme
}

@Component({
  selector: 'sofie-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent extends StronglyTypedDialog<ConfirmationDialogData, boolean> {
  public title: string = $localize`confirmation-dialog.are-you-sure.title`
  public message: string = ''
  public okButtonText: string = $localize`confirmation-dialog.yes.button`
  public cancelButtonText: string = $localize`confirmation-dialog.cancel.button`
  public theme: DialogColorTheme
  public severity: DialogSeverity

  protected readonly DialogColorTheme = DialogColorTheme

  @HostBinding('class')
  public get severityClass(): string {
    return this.severity.toLowerCase()
  }

  public get buttonColor(): ThemePalette {
    switch (this.severity) {
      case DialogSeverity.DANGER:
        return 'warn'
      default:
        return 'primary'
    }
  }

  constructor(@Inject(MAT_DIALOG_DATA) data: ConfirmationDialogData, dialogRef: MatDialogRef<StronglyTypedDialog<ConfirmationDialogData, boolean>, boolean>) {
    super(data, dialogRef)
    if (!data) {
      return
    }
    this.title = data.title ?? this.title
    this.message = data.message ?? this.message
    this.okButtonText = data.buttonText?.ok ?? this.okButtonText
    this.cancelButtonText = data.buttonText?.cancel ?? this.cancelButtonText
    this.severity = data.severity ?? DialogSeverity.INFO
    this.theme = data.theme ?? DialogColorTheme.LIGHT
  }
}
