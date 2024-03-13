import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { KeyboardMapping } from '../keyboard-mapping-settings-page/keyboard-mapping-settings-page.component'

@Component({
  // There is no selector because this component is only allowed to be called through the DialogService.
  templateUrl: './edit-keyboard-mapping-dialog.component.html',
})
export class EditKeyboardMappingDialogComponent {
  public readonly keyboardMapping?: KeyboardMapping

  constructor(
    @Inject(MAT_DIALOG_DATA) keyboardMapping: KeyboardMapping,
    private readonly dialogRef: MatDialogRef<EditKeyboardMappingDialogComponent>
  ) {
    this.keyboardMapping = keyboardMapping
  }

  public getTitle(): string {
    return this.keyboardMapping ? $localize`edit-keyboard-mapping.edit` : $localize`edit-keyboard-mapping.create`
  }

  public closeDialog(keyboardMapping?: KeyboardMapping): void {
    this.dialogRef.close(keyboardMapping)
  }
}
