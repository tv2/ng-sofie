import { Component, Inject } from '@angular/core'
import { ShelfActionPanelConfiguration } from '../../../../shared/models/shelf-configuration'
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog'

@Component({
  // There is no selector because this component is only allowed to be called through the DialogService.
  templateUrl: './edit-shelf-action-panel-configuration-dialog.component.html',
})
export class EditShelfActionPanelConfigurationDialogComponent {
  public actionPanel?: ShelfActionPanelConfiguration

  constructor(
    @Inject(MAT_DIALOG_DATA) actionPanel: ShelfActionPanelConfiguration | undefined,
    private readonly dialogRef: MatDialogRef<EditShelfActionPanelConfigurationDialogComponent>
  ) {
    this.actionPanel = actionPanel
  }

  public getTitle(): string {
    return this.actionPanel ? $localize`edit-shelf-action-panel-configuration.edit` : $localize`edit-shelf-action-panel-configuration.create`
  }

  public closeDialog(actionPanel?: ShelfActionPanelConfiguration): void {
    this.dialogRef.close(actionPanel)
  }
}
