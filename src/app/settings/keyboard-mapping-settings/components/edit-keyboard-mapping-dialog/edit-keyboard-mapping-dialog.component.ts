import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { EditKeyboardMapping } from '../keyboard-mapping-settings-page/keyboard-mapping-settings-page.component'

@Component({
  // There is no selector because this component is only allowed to be called through the DialogService.
  templateUrl: './edit-keyboard-mapping-dialog.component.html',
})
export class EditKeyboardMappingDialogComponent {
  public readonly editKeyboardMapping?: EditKeyboardMapping

  constructor(
    @Inject(MAT_DIALOG_DATA) editKeyboardMapping: EditKeyboardMapping,
    private readonly dialogRef: MatDialogRef<EditKeyboardMappingDialogComponent>
  ) {
    this.editKeyboardMapping = editKeyboardMapping
  }

  public getTitle(): string {
    return this.editKeyboardMapping && this.editKeyboardMapping.keyboardMapping ? $localize`edit-keyboard-mapping.edit` : $localize`edit-keyboard-mapping.create`
  }

  public closeDialog(editKeyboardMapping?: EditKeyboardMapping): void {
    this.dialogRef.close(editKeyboardMapping)
  }
}
