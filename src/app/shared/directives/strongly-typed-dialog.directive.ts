import { Directive, Inject } from '@angular/core'
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog'

@Directive()
export abstract class StronglyTypedDialog<DialogData, DialogResult> {
  protected constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<StronglyTypedDialog<DialogData, DialogResult>, DialogResult>
  ) {}
}
