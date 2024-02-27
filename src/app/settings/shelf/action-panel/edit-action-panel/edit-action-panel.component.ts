import { ShelfActionPanelConfiguration, ShelfActionPanelConfigurationWithId, ShelfConfiguration } from 'src/app/shared/models/shelf-configuration'
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core'
import { AbstractControl, FormBuilder, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms'
import { MultiSelectOptions } from 'src/app/shared/components/multi-select/multi-select.component'
import { Tv2ActionContentType } from 'src/app/shared/models/tv2-action'
import { ConfigurationService } from 'src/app/shared/services/configuration.service'
import { IconButton, IconButtonSize } from 'src/app/shared/enums/icon-button'
import { TranslationKnownValuesPipe } from 'src/app/shared/pipes/translation-known-values.pipe'

@Component({
  selector: 'sofie-edit-action-panel',
  templateUrl: './edit-action-panel.component.html',
  styleUrls: ['./edit-action-panel.component.scss'],
})
export class EditActionPanelComponent implements OnInit {
  @Input() public shelfConfiguration: ShelfConfiguration<ShelfActionPanelConfigurationWithId>
  @Input() public actionPanelIndex?: number
  @Input() public iconButtonSize: IconButtonSize
  @Input() public iconButton: IconButton
  @Input() public buttonLabel: string
  @Input() public buttonTooltipText: string
  @Input() public buttonClasses: string

  public filterActionPanelOptions: MultiSelectOptions[]
  public isEditDialogOpen: boolean = false
  public isSubmitting: boolean = false

  public submitButtonLabel: string
  public dialogTitleLabel: string
  public readonly actionPanelNameLabel: string = $localize`action-panel.panel-name.label`
  public readonly actionPanelFiltersLabel: string = $localize`global.filters.label`
  public readonly rankPanelLabel: string = $localize`action-panel.rank.label`
  public readonly submitButtonTooltipError = $localize`global.submit-tooltip.error`
  public readonly noFiltersSelectedLabel = $localize`action-panel.no-filters-selected.label`

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly translationKnownValuesPipe: TranslationKnownValuesPipe,
    private readonly configurationService: ConfigurationService
  ) {}

  public panelForm: UntypedFormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    actionFilter: this.formBuilder.array([], [Validators.required]),
    rank: [0, [Validators.required, Validators.min(1)]],
  })

  public ngOnInit(): void {
    this.submitButtonLabel = this.actionPanelIndex !== undefined ? $localize`global.update.button` : $localize`global.create.button`
    this.dialogTitleLabel = this.actionPanelIndex !== undefined ? $localize`action-panel.update-title.label` : $localize`action-panel.create-title.label`
    const tv2ActionContentTypeArray: string[] = Object.keys(Tv2ActionContentType)
    this.filterActionPanelOptions = tv2ActionContentTypeArray.map(key => {
      return { id: key, label: this.translationKnownValuesPipe.transform(key), classesOnSelected: `${key.toLocaleLowerCase()}_color` }
    })
    if (this.actionPanelIndex !== undefined && this.shelfConfiguration.actionPanelConfigurations[this.actionPanelIndex]) {
      this.patchValue(this.shelfConfiguration.actionPanelConfigurations[this.actionPanelIndex])
    }
  }

  private patchValue(actionValue: ShelfActionPanelConfiguration): void {
    this.panelForm.patchValue(actionValue)
    this.addArrayValues(actionValue.actionFilter, this.formFiltersArray)
  }

  public actionPanelFiltersChange(selectedFiltersIds: string[]): void {
    this.formFiltersArray.clear()
    this.addArrayValues(selectedFiltersIds, this.formFiltersArray)
  }

  public get formFiltersArray(): UntypedFormArray {
    return this.panelForm.get('actionFilter') as UntypedFormArray
  }

  public changeKeyboardKeyValue(newKeys: string[], formKeyArray: UntypedFormArray): void {
    formKeyArray.clear()
    this.addArrayValues(newKeys, formKeyArray)
  }

  private addArrayValues(items: string[], formArray: UntypedFormArray): void {
    for (const item of items) {
      this.createKey(item, formArray)
    }
  }

  private createKey(item: string, formArray: UntypedFormArray): void {
    const control = new UntypedFormControl(item)
    formArray.push(control)
  }

  public formSubmit(): void {
    this.isEditDialogOpen = false
    if (this.panelForm.invalid) {
      this.panelForm.markAllAsTouched()
      return
    }
    this.isSubmitting = true
    this.updateActionPanel(this.panelForm.value)
  }

  private updateActionPanel(editActionPanelValue: ShelfActionPanelConfiguration): void {
    const copyOfShelfConfiguration: ShelfConfiguration<ShelfActionPanelConfiguration> = JSON.parse(JSON.stringify(this.shelfConfiguration))
    if (this.actionPanelIndex !== undefined) {
      copyOfShelfConfiguration.actionPanelConfigurations[this.actionPanelIndex] = editActionPanelValue
    } else {
      copyOfShelfConfiguration.actionPanelConfigurations.push(editActionPanelValue)
    }
    this.configurationService.updateShelfConfiguration(copyOfShelfConfiguration).subscribe(() => {
      this.isEditDialogOpen = false
      this.isSubmitting = false
      if (this.actionPanelIndex === undefined) {
        this.customFormReset()
      }
      this.changeDetectorRef.detectChanges()
    })
  }

  private customFormReset(): void {
    this.panelForm.reset()
    this.formFiltersArray.clear()
  }

  public get getFormValidationErrors(): string {
    const errorsFields = []
    if (this.isFormControlInvalid('name')) {
      errorsFields.push(this.actionPanelNameLabel)
    }
    if (this.isFormControlInvalid('rank')) {
      errorsFields.push(this.rankPanelLabel)
    }
    if (this.isFormControlInvalid('actionFilter')) {
      errorsFields.push(this.actionPanelFiltersLabel)
    }
    return errorsFields.join(', ')
  }

  private isFormControlInvalid(name: string, groupName?: string): boolean | undefined {
    if (groupName) {
      return this.getFormAbstractControl(name, groupName)?.invalid
    } else {
      return this.getFormAbstractControl(name).invalid
    }
  }

  private getFormAbstractControl(name: string, groupName?: string): AbstractControl {
    if (groupName) {
      return this.panelForm.get(groupName)?.get(name) as AbstractControl
    } else {
      return this.panelForm.controls[name]
    }
  }
}
