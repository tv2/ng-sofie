import { Component, Inject } from '@angular/core'
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog'
import { EditKeyboardMappingResponse } from '../edit-keyboard-mapping/edit-keyboard-mapping.component'
import { KeyboardMapping } from '../keyboard-mapping-settings-page/keyboard-mapping-settings-page.component'

@Component({
  // There is no selector because this component is only allowed to be called through the DialogService.
  templateUrl: './edit-keyboard-mapping-dialog.component.html',
})
export class EditKeyboardMappingDialogComponent {
  public readonly keyboardMapping?: KeyboardMapping

  constructor(
    @Inject(MAT_DIALOG_DATA) keyboardMapping: KeyboardMapping | undefined,
    private readonly dialogRef: MatDialogRef<EditKeyboardMappingDialogComponent>
  ) {
    this.keyboardMapping = keyboardMapping
  }

  public getTitle(): string {
    return this.keyboardMapping ? $localize`edit-keyboard-mapping.edit` : $localize`edit-keyboard-mapping.create`
  }

  public closeDialog(editKeyboardMappingResponse?: EditKeyboardMappingResponse): void {
    this.dialogRef.close(editKeyboardMappingResponse)
  }
}
