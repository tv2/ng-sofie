import { Component, Inject } from '@angular/core'
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog'
import { Tv2Action } from '../../../../shared/models/tv2-action'

@Component({
  templateUrl: './edit-static-buttons-dialog.component.html',
})
export class EditStaticButtonsDialogComponent {
  public readonly selectedStaticActions?: Tv2Action[]

  constructor(
    @Inject(MAT_DIALOG_DATA) selectedStaticActions: Tv2Action[],
    private readonly dialogRef: MatDialogRef<EditStaticButtonsDialogComponent>
  ) {
    this.selectedStaticActions = selectedStaticActions
  }

  public getTitle(): string {
    return $localize`edit-static-buttons-dialog.header`
  }

  public closeDialog(selectedStaticActions?: Tv2Action[]): void {
    this.dialogRef.close(selectedStaticActions)
  }
}
