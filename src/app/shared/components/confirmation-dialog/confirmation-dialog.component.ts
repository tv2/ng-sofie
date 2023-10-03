import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { StronglyTypedDialog } from '../../directives/strongly-typed-dialog.directive'

export interface ConfirmationDialogData {
  title?: string
  message?: string
  buttonText?: {
    ok: string
    cancel?: string
  }
}

@Component({
  selector: 'sofie-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent extends StronglyTypedDialog<ConfirmationDialogData, boolean> {
  public title: string = 'Are you sure?'
  public message: string = ''
  public okButtonText: string = 'Yes'
  public cancelButtonText: string = 'Cancel'

  constructor(@Inject(MAT_DIALOG_DATA) data: ConfirmationDialogData, dialogRef: MatDialogRef<StronglyTypedDialog<ConfirmationDialogData, boolean>, boolean>) {
    super(data, dialogRef)
    if (!data) return
    this.title = data.title ?? this.title
    this.message = data.message ?? this.message
    this.okButtonText = data.buttonText?.ok ?? this.okButtonText
    this.cancelButtonText = data.buttonText?.cancel ?? this.cancelButtonText
  }
}
