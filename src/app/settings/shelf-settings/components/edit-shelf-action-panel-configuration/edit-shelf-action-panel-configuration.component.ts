import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ShelfActionPanelConfiguration } from '../../../../shared/models/shelf-configuration'
import { Tv2ActionContentType } from '../../../../shared/models/tv2-action'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { TranslateActionTypePipe } from '../../../../shared/pipes/translate-action-type.pipe'
import { SelectOption } from '../../../../shared/models/select-option'

const PANEL_NAME_CONTROL_ID: string = 'name'
const PANEL_ACTION_FILTER_CONTROL_ID: string = 'actionFilter'
const PANEL_RANK_CONTROL_ID: string = 'rank'

@Component({
  selector: 'sofie-edit-shelf-action-panel-configuration',
  templateUrl: './edit-shelf-action-panel-configuration.component.html',
})
export class EditShelfActionPanelConfigurationComponent implements OnInit {
  @Input() public actionPanel?: ShelfActionPanelConfiguration

  @Output() public onSave: EventEmitter<ShelfActionPanelConfiguration> = new EventEmitter()
  @Output() public onCancel: EventEmitter<void> = new EventEmitter()

  public actionContentOptions: SelectOption<Tv2ActionContentType>[] = []

  public form: FormGroup

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly translationActionTypePipe: TranslateActionTypePipe
  ) {}

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

  public save(): void {
    this.actionPanel = {
      ...this.actionPanel,
      ...this.form.value,
    }

    this.onSave.emit(this.actionPanel)
  }

  public cancel(): void {
    this.onCancel.emit()
  }

  public get invalidControlsErrorMessage(): string | undefined {
    const invalidControlsLabels: string[] = this.findInvalidControlsLabels()
    if (invalidControlsLabels.length > 0) {
      return $localize`common.form-required-field.button-tooltip` + ` ${invalidControlsLabels.join(', ')}`
    } else {
      return undefined
    }
  }

  private findInvalidControlsLabels(): string[] {
    return Object.entries({ ...this.form.controls })
      .filter(([name, control]) => !control.valid && name)
      .map(([name]) => this.translateControl(name))
  }

  private translateControl(controlName: string): string {
    switch (controlName) {
      case PANEL_NAME_CONTROL_ID:
        return $localize`action-panel.panel-name.label`
      case PANEL_ACTION_FILTER_CONTROL_ID:
        return $localize`global.filters.label`
      case PANEL_RANK_CONTROL_ID:
        return $localize`action-panel.rank.label`
      default:
        return controlName
    }
  }
}
