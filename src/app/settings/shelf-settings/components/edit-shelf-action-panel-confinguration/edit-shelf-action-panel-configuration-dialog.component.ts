import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ShelfActionPanelConfiguration } from '../../../../shared/models/shelf-configuration'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'sofie-edit-shelf-action-panel-configuration-dialog',
  templateUrl: './edit-shelf-action-panel-configuration-dialog.component.html',
  styleUrls: ['./edit-shelf-action-panel-configuration-dialog.component.scss'],
})
export class EditShelfActionPanelConfigurationDialogComponent implements OnInit {
  public actionPanel: ShelfActionPanelConfiguration

  public form: FormGroup

  constructor(
    @Inject(MAT_DIALOG_DATA) actionPanel: ShelfActionPanelConfiguration,
    private readonly dialogRef: MatDialogRef<EditShelfActionPanelConfigurationDialogComponent>,
    private readonly formBuilder: FormBuilder
  ) {
    this.actionPanel = actionPanel
  }

  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: [this.actionPanel.name, [Validators.required]],
      rank: [this.actionPanel.rank, [Validators.required]],
    })
  }

  public save(): void {
    this.actionPanel = {
      ...this.actionPanel,
      ...this.form.value,
    }

    this.dialogRef.close(this.actionPanel)
  }

  public cancel(): void {
    this.dialogRef.close()
  }
}
