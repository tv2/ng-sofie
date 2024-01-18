import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange, SimpleChanges } from '@angular/core'
import { AbstractControl, FormBuilder, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms'
import { ActionTrigger, ActionTriggerWithActionInfo } from 'src/app/shared/models/action-trigger'
import { Tv2PartAction } from 'src/app/shared/models/tv2-action'
import { ActionTriggerService } from 'src/app/shared/abstractions/action-trigger.service'
import { IconButton, IconButtonSize } from 'src/app/shared/enums/icon-button'
import { SelectFieldOptions } from 'src/app/shared/models/forms'
import { KeyEventType } from 'src/app/keyboard/value-objects/key-event-type'
import { ActionArgumentSchema } from 'src/app/shared/models/action'
import { KeyboardTriggerData, SHORTCUT_KEYS_MAPPINGS } from 'src/app/shared/models/keyboard-trigger'

@Component({
  selector: 'sofie-edit-action-triggers',
  templateUrl: './edit-action-triggers.component.html',
  styleUrls: ['./edit-action-triggers.component.scss'],
})
export class EditActionTriggersComponent implements OnChanges {
  @Output() public readonly onCancel: EventEmitter<void> = new EventEmitter<void>()
  @Input() public selectedActionTrigger?: ActionTriggerWithActionInfo<KeyboardTriggerData>
  @Input() public actions: Tv2PartAction[]
  private keyPress: boolean = false
  public mappedToKeysFocus: boolean = false
  public submitting: boolean = false
  public selectedAction: Tv2PartAction | undefined
  public readonly keysLabel = $localize`action-triggers.shortcut.label`
  public readonly physicalMappingLabel = $localize`action-triggers.physical-mapping.label`
  public readonly triggerOnLabel = $localize`action-triggers.trigger-on.label`
  public readonly selectedActionLabel = $localize`action-triggers.selected-action.label`
  public readonly submitBtnTooltipError = $localize`action-triggers.submit-tooltip.error`
  public readonly actionArgumentSchema = ActionArgumentSchema
  public readonly iconButton = IconButton
  public readonly iconButtonSize = IconButtonSize
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
    if (!!this.selectedAction && !!this.selectedAction.argument) {
      this.control('actionArguments', 'data').setValidators([Validators.required])
    } else {
      this.control('actionArguments', 'data').clearValidators()
      this.control('actionArguments', 'data').setErrors(null)
    }
    this.actionForm.updateValueAndValidity()
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const actionTriggerChange: SimpleChange | undefined = changes['selectedActionTrigger']
    if (!actionTriggerChange) {
      return
    }
    const action: ActionTriggerWithActionInfo<KeyboardTriggerData> = actionTriggerChange.currentValue
    this.formKeysArray.clear()
    this.formMappedToKeysArray.clear()
    if (action) {
      this.patchValue(action)
      this.selectedAction = action.actionInfo
    } else {
      this.customFormReset()
      this.selectedAction = undefined
    }
    this.checkActionAndSetValidators()
  }

  private customFormReset(): void {
    this.actionForm.reset()
    this.formKeysArray.clear()
    this.formMappedToKeysArray.clear()
    this.control('triggerOn', 'data').patchValue(KeyEventType.RELEASED)
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
    this.addArrValues(actionValue.data.keys, this.formKeysArray)
    if (actionValue.data.mappedToKeys) {
      this.addArrValues(actionValue.data.mappedToKeys, this.formMappedToKeysArray)
    }
  }

  public onKeyDownShortcut(event: KeyboardEvent): void {
    event.preventDefault()
    const newKeyCode: string = SHORTCUT_KEYS_MAPPINGS[event.code] ? SHORTCUT_KEYS_MAPPINGS[event.code] : event.code
    if (!this.keyPress) {
      this.formKeysArray.clear()
      this.createKey(newKeyCode, this.formKeysArray)
      this.keyPress = true
      return
    }
    const currentKeys: string[] = this.formKeysArray?.value ? this.formKeysArray?.value : []
    if (currentKeys.every(keyCode => keyCode !== newKeyCode)) {
      this.createKey(newKeyCode, this.formKeysArray)
    }
  }

  public onKeyDownMapTo(event: KeyboardEvent): void {
    event.preventDefault()
    if (this.mappedToKeysFocus) {
      this.mappedToKeysFocus = false
      this.formMappedToKeysArray.clear()
    }
    const newKeyCode: string = SHORTCUT_KEYS_MAPPINGS[event.code] ? SHORTCUT_KEYS_MAPPINGS[event.code] : event.code

    const currentKeys: string[] = this.formMappedToKeysArray?.value ? this.formMappedToKeysArray?.value : []
    if (currentKeys.every(keyCode => keyCode !== newKeyCode)) {
      this.createKey(newKeyCode, this.formMappedToKeysArray)
    }
  }

  public deleteMapToData(): void {
    this.formMappedToKeysArray.clear()
  }

  private get formKeysArray(): UntypedFormArray {
    return this.actionForm?.get('data')?.get('keys') as UntypedFormArray
  }

  private get formMappedToKeysArray(): UntypedFormArray {
    return this.actionForm?.get('data')?.get('mappedToKeys') as UntypedFormArray
  }

  private addArrValues(items: string[], formArray: UntypedFormArray): void {
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
    this.control('actionArguments', 'data').patchValue('')
    this.checkActionAndSetValidators()
  }

  public onKeyUpShortcut(): void {
    this.keyPress = false
  }

  public get isUpdateForm(): boolean {
    return !!this.selectedActionTrigger
  }

  public submit(): void {
    if (this.actionForm.invalid) {
      this.actionForm.markAllAsTouched()
      return
    }
    this.submitting = true
    if (!this.control('label', 'data').value) {
      this.control('label', 'data').patchValue((this.selectedAction as Tv2PartAction).name)
    }
    const actionTriggerValue: ActionTrigger<KeyboardTriggerData> = this.prepareSendData(this.actionForm.value)
    if (this.isUpdateForm) {
      this.updateActionTrigger({ ...actionTriggerValue, id: this.selectedActionTrigger?.id as string })
    } else {
      this.createActionTrigger(actionTriggerValue)
    }
  }

  private prepareSendData(formData: ActionTrigger<KeyboardTriggerData>): ActionTrigger<KeyboardTriggerData> {
    const resultData: ActionTrigger<KeyboardTriggerData> = { ...formData }
    if (this.selectedAction?.argument) {
      resultData.data.actionArguments =
        formData?.data?.actionArguments && this.selectedAction?.argument.type === ActionArgumentSchema.NUMBER ? +formData?.data?.actionArguments : formData.data.actionArguments
    } else {
      delete resultData.data.actionArguments
    }
    return resultData
  }

  private createActionTrigger(actionTrigger: ActionTrigger<KeyboardTriggerData>): void {
    this.actionTriggerService.createActionTrigger(actionTrigger).subscribe(() => {
      this.customFormReset()
      this.selectedAction = undefined
      this.checkActionAndSetValidators()
      this.submitting = false
    })
  }

  private updateActionTrigger(actionTrigger: ActionTrigger<KeyboardTriggerData>): void {
    this.actionTriggerService.updateActionTrigger(actionTrigger).subscribe(() => (this.submitting = false))
  }

  private control(name: string, groupName?: string): AbstractControl {
    if (!!groupName) {
      return this.actionForm.get(groupName)?.get(name) as AbstractControl
    } else {
      return this.actionForm.controls[name]
    }
  }

  private isFormControlInvalid(name: string, groupName?: string): boolean | undefined {
    if (!!groupName) {
      return this.control(name, groupName)?.invalid
    } else {
      return this.control(name).invalid
    }
  }
}
