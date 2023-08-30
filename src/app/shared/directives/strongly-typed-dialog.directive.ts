import { Directive, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Directive()
export abstract class StronglyTypedDialog<DialogData, DialogResult> {
    protected constructor(
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        public dialogRef: MatDialogRef<StronglyTypedDialog<DialogData, DialogResult>,
            DialogResult>
    ) {
    }
}
