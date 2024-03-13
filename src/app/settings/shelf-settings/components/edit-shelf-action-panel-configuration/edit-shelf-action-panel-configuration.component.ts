import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ShelfActionPanelConfiguration } from '../../../../shared/models/shelf-configuration'
import { MultiSelectOption } from '../../../../shared/components/multi-select/multi-select.component'
import { Tv2ActionContentType } from '../../../../shared/models/tv2-action'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { TranslateActionTypePipe } from '../../../../shared/pipes/translate-action-type.pipe'

@Component({
  selector: 'sofie-edit-shelf-action-panel-configuration',
  templateUrl: './edit-shelf-action-panel-configuration.component.html',
})
export class EditShelfActionPanelConfigurationComponent implements OnInit {
  public nameLabel: string = $localize`action-panel.panel-name.label`
  public filterLabel: string = $localize`global.filters.label`
  public rankLabel: string = $localize`action-panel.rank.label`

  @Input() public actionPanel?: ShelfActionPanelConfiguration

  @Output() public onSave: EventEmitter<ShelfActionPanelConfiguration> = new EventEmitter()
  @Output() public onCancel: EventEmitter<void> = new EventEmitter()

  public actionContentOptions: MultiSelectOption<Tv2ActionContentType>[] = []

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
}
