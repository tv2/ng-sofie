import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ShelfActionPanelConfiguration } from '../../../../shared/models/shelf-configuration'
import { Tv2ActionContentType } from '../../../../shared/models/tv2-action'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { TranslateActionTypePipe } from '../../../../shared/pipes/translate-action-type.pipe'
import { SelectOption } from '../../../../shared/models/select-option'

const FORM_NAME_CONTROL_LABEL: string = 'name'
const FORM_ACTION_FILTER_CONTROL_LABEL: string = 'actionFilter'
const FORM_RANK_CONTROL_LABEL: string = 'rank'

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

  public get saveButtonErrorsTooltip(): string | undefined {
    const invalidControlsLabels: string[] = this.findInvalidControlsLabels()
    return invalidControlsLabels.length > 0 ? $localize`common.form-required-field.button-tooltip` + `: ${invalidControlsLabels.join(', ')}` : undefined
  }

  private findInvalidControlsLabels(): string[] {
    const invalidControlLabels: string[] = []
    const controls = this.form.controls
    for (const name in this.form.controls) {
      if (controls[name].valid) {
        continue
      }
      const translateControl: string | undefined = this.translateControl(name)
      if (translateControl) {
        invalidControlLabels.push(translateControl)
      }
    }
    return invalidControlLabels
  }

  private translateControl(controlName: string): string | undefined {
    switch (controlName) {
      case FORM_NAME_CONTROL_LABEL:
        return $localize`action-panel.panel-name.label`
      case FORM_ACTION_FILTER_CONTROL_LABEL:
        return $localize`global.filters.label`
      case FORM_RANK_CONTROL_LABEL:
        return $localize`action-panel.rank.label`
      default:
        return undefined
    }
  }
}
