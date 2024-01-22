import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange, SimpleChanges } from '@angular/core'
import { AbstractControl, FormBuilder, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms'
import { ActionTrigger, ActionTriggerWithAction } from 'src/app/shared/models/action-trigger'
import { Tv2PartAction } from 'src/app/shared/models/tv2-action'
import { ActionTriggerService } from 'src/app/shared/abstractions/action-trigger.service'
import { IconButton, IconButtonSize } from 'src/app/shared/enums/icon-button'
import { SelectFieldOptions } from 'src/app/shared/models/forms'
import { KeyEventType } from 'src/app/keyboard/value-objects/key-event-type'
import { ActionArgumentSchemaType } from 'src/app/shared/models/action'
import { KeyboardTriggerData } from 'src/app/shared/models/keyboard-trigger'

@Component({
  selector: 'sofie-edit-action-triggers',
  templateUrl: './edit-action-triggers.component.html',
  styleUrls: ['./edit-action-triggers.component.scss'],
})
export class EditActionTriggersComponent implements OnChanges {
  @Output() public readonly onCancel: EventEmitter<void> = new EventEmitter<void>()
  @Input() public selectedActionTrigger?: ActionTriggerWithAction<KeyboardTriggerData>
  @Input() public actions: Tv2PartAction[]
  public isSubmitting: boolean = false
  public selectedAction: Tv2PartAction | undefined
  public readonly keysLabel = $localize`action-triggers.shortcut.label`
  public readonly physicalMappingLabel = $localize`action-triggers.physical-mapping.label`
  public readonly physicalMappingHelpInfo = $localize`action-triggers.physical-mapping-help.tooltip`
  public readonly triggerOnLabel = $localize`action-triggers.trigger-on.label`
  public readonly selectedActionLabel = $localize`action-triggers.selected-action.label`
  public readonly submitButtonTooltipError = $localize`action-triggers.submit-tooltip.error`
  public readonly ActionArgumentSchemaType = ActionArgumentSchemaType
  public readonly IconButton = IconButton
  public readonly IconButtonSize = IconButtonSize
  public readonly triggerOnOptions: SelectFieldOptions[] = [
    { key: KeyEventType.PRESSED, label: $localize`global.on-key-pressed.label` },
    { key: KeyEventType.RELEASED, label: $localize`global.on-key-released.label` },
  ]
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly actionTriggerService: ActionTriggerService
  ) {}

  public actionForm: UntypedFormGroup = this.formBuilder.group({
    actionId: ['', [Validators.required]],
    data: this.formBuilder.group({
      keys: this.formBuilder.array([], [Validators.required]),
      actionArguments: [''],
      label: [''],
      triggerOn: [KeyEventType.RELEASED, [Validators.required]],
      mappedToKeys: this.formBuilder.array([]),
    }),
  })

  private checkActionAndSetValidators(): void {
    if (this.selectedAction && this.selectedAction.argument) {
      this.getFormAbstractControl('actionArguments', 'data').setValidators([Validators.required])
    } else {
      this.getFormAbstractControl('actionArguments', 'data').clearValidators()
      this.getFormAbstractControl('actionArguments', 'data').setErrors(null)
    }
    this.actionForm.updateValueAndValidity()
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const actionTriggerChange: SimpleChange | undefined = changes['selectedActionTrigger']
    if (!actionTriggerChange) {
      return
    }
    const action: ActionTriggerWithAction<KeyboardTriggerData> = actionTriggerChange.currentValue
    this.formKeysArray.clear()
    this.formMappedToKeysArray.clear()
    if (action) {
      this.patchValue(action.actionTrigger)
      this.selectedAction = action.action
    } else {
      this.resetCustomForm()
      this.selectedAction = undefined
    }
    this.checkActionAndSetValidators()
  }

  private resetCustomForm(): void {
    this.actionForm.reset()
    this.formKeysArray.clear()
    this.formMappedToKeysArray.clear()
    this.getFormAbstractControl('triggerOn', 'data').patchValue(KeyEventType.RELEASED)
  }

  public get getFormValidationErrors(): string {
    const errorsFields = []
    if (this.isFormControlInvalid('actionId')) {
      errorsFields.push(this.selectedActionLabel)
    }
    if (this.isFormControlInvalid('keys', 'data')) {
      errorsFields.push(this.keysLabel)
    }
    if (this.isFormControlInvalid('triggerOn', 'data')) {
      errorsFields.push(this.triggerOnLabel)
    }
    if (this.isFormControlInvalid('actionArguments', 'data') && this.selectedAction?.argument) {
      errorsFields.push(this.selectedAction.argument.name)
    }

    return errorsFields.join(', ')
  }

  private patchValue(actionValue: ActionTrigger<KeyboardTriggerData>): void {
    this.actionForm.patchValue(actionValue)
    this.addArrayValues(actionValue.data.keys, this.formKeysArray)
    if (actionValue.data.mappedToKeys) {
      this.addArrayValues(actionValue.data.mappedToKeys, this.formMappedToKeysArray)
    }
  }

  public changeKeyboardKeyValue(newKeys: string[], formKeyArray: UntypedFormArray): void {
    formKeyArray.clear()
    this.addArrayValues(newKeys, formKeyArray)
  }

  public get formKeysArray(): UntypedFormArray {
    return this.actionForm?.get('data')?.get('keys') as UntypedFormArray
  }

  public get formMappedToKeysArray(): UntypedFormArray {
    return this.actionForm?.get('data')?.get('mappedToKeys') as UntypedFormArray
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

  public openNewActionTrigger(action: Tv2PartAction): void {
    this.actionForm.patchValue({ actionId: action.id })
    this.selectedAction = action
    this.getFormAbstractControl('actionArguments', 'data').patchValue('')
    this.checkActionAndSetValidators()
  }

  public get isUpdateForm(): boolean {
    return !!this.selectedActionTrigger
  }

  public submit(): void {
    if (this.actionForm.invalid) {
      this.actionForm.markAllAsTouched()
      return
    }
    this.isSubmitting = true
    if (!this.getFormAbstractControl('label', 'data').value) {
      this.getFormAbstractControl('label', 'data').patchValue((this.selectedAction as Tv2PartAction).name)
    }
    const actionTriggerValue: ActionTrigger<KeyboardTriggerData> = this.prepareDataForTransfer(this.actionForm.value)
    if (this.isUpdateForm) {
      this.updateActionTrigger({ ...actionTriggerValue, id: this.selectedActionTrigger?.actionTrigger.id as string })
    } else {
      this.createActionTrigger(actionTriggerValue)
    }
  }

  private prepareDataForTransfer(formData: ActionTrigger<KeyboardTriggerData>): ActionTrigger<KeyboardTriggerData> {
    const resultData: ActionTrigger<KeyboardTriggerData> = { ...formData }
    if (this.selectedAction?.argument) {
      resultData.data.actionArguments =
        formData?.data?.actionArguments && this.selectedAction?.argument.type === ActionArgumentSchemaType.NUMBER ? +formData?.data?.actionArguments : formData.data.actionArguments
    } else {
      delete resultData.data.actionArguments
    }
    return resultData
  }

  private createActionTrigger(actionTrigger: ActionTrigger<KeyboardTriggerData>): void {
    this.actionTriggerService.createActionTrigger(actionTrigger).subscribe(() => {
      this.resetCustomForm()
      this.selectedAction = undefined
      this.checkActionAndSetValidators()
      this.isSubmitting = false
    })
  }

  private updateActionTrigger(actionTrigger: ActionTrigger<KeyboardTriggerData>): void {
    this.actionTriggerService.updateActionTrigger(actionTrigger).subscribe(() => (this.isSubmitting = false))
  }

  private getFormAbstractControl(name: string, groupName?: string): AbstractControl {
    if (groupName) {
      return this.actionForm.get(groupName)?.get(name) as AbstractControl
    } else {
      return this.actionForm.controls[name]
    }
  }

  private isFormControlInvalid(name: string, groupName?: string): boolean | undefined {
    if (groupName) {
      return this.getFormAbstractControl(name, groupName)?.invalid
    } else {
      return this.getFormAbstractControl(name).invalid
    }
  }
}
