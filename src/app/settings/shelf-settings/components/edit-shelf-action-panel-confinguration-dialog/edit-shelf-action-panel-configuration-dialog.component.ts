import { Component, Inject } from '@angular/core'
import { ShelfActionPanelConfiguration } from '../../../../shared/models/shelf-configuration'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  // There is no selector because this component is only allowed to be called through the DialogService.
  templateUrl: './edit-shelf-action-panel-configuration-dialog.component.html',
})
export class EditShelfActionPanelConfigurationDialogComponent {
  public actionPanel?: ShelfActionPanelConfiguration

  constructor(
    @Inject(MAT_DIALOG_DATA) actionPanel: ShelfActionPanelConfiguration,
    private readonly dialogRef: MatDialogRef<EditShelfActionPanelConfigurationDialogComponent>
  ) {
    this.actionPanel = actionPanel
  }

  public getTitle(): string {
    return this.actionPanel ? 'Edit Action Panel' : 'Create Action Panel'
  }

  public closeDialog(actionPanel?: ShelfActionPanelConfiguration): void {
    this.dialogRef.close(actionPanel)
  }
}
