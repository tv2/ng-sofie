import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ShelfActionPanelConfiguration } from '../../../../shared/models/shelf-configuration'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MultiSelectOption } from '../../../../shared/components/multi-select/multi-select.component'
import { Tv2ActionContentType } from '../../../../shared/models/tv2-action'
import { TranslationActionTypePipe } from '../../../../shared/pipes/translation-known-values.pipe'

@Component({
  // There is no selector because this component is only allowed to be called through the DialogService.
  templateUrl: './edit-shelf-action-panel-configuration-dialog.component.html',
})
export class EditShelfActionPanelConfigurationDialogComponent implements OnInit {
  public nameLabel: string = $localize`action-panel.panel-name.label`
  public filterLabel: string = $localize`global.filters.label`
  public rankLabel: string = $localize`action-panel.rank.label`

  public actionPanel?: ShelfActionPanelConfiguration
  public actionContentOptions: MultiSelectOption<Tv2ActionContentType>[] = []

  public form: FormGroup

  constructor(
    @Inject(MAT_DIALOG_DATA) actionPanel: ShelfActionPanelConfiguration,
    private readonly dialogRef: MatDialogRef<EditShelfActionPanelConfigurationDialogComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly translationActionTypePipe: TranslationActionTypePipe
  ) {
    this.actionPanel = actionPanel
  }

  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: [this.actionPanel?.name ?? '', [Validators.required]],
      actionFilter: [this.actionPanel?.actionFilter ?? [], [Validators.required]],
      rank: [this.actionPanel?.rank ?? 0, [Validators.required]],
    })

    this.actionContentOptions = Object.values(Tv2ActionContentType).map(actionContent => {
      return {
        name: this.translationActionTypePipe.transform(actionContent),
        value: actionContent,
      }
    })
  }

  public getTitle(): string {
    return this.actionPanel ? 'Edit Action Panel' : 'Create Action Panel'
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
