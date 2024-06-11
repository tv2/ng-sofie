import { Component, HostBinding, Inject } from '@angular/core'
import { StronglyTypedDialog } from '../../directives/strongly-typed-dialog.directive'
import { ThemePalette } from '@angular/material/core'
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog'

export enum DialogSeverity {
  INFO = 'INFO',
  DANGER = 'DANGER',
}

export enum DialogColorScheme {
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
  theme?: DialogColorScheme
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
  public theme: DialogColorScheme
  public severity: DialogSeverity

  protected readonly DialogColorScheme = DialogColorScheme

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
    this.theme = data.theme ?? DialogColorScheme.LIGHT
  }
}
