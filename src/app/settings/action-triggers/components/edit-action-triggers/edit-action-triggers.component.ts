import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange, SimpleChanges } from '@angular/core'
import { AbstractControl, FormBuilder, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms'
import { ActionTrigger, ActionTriggerWithActionInfo, CreateActionTrigger, KeyboardAndSelectionTriggerData, KeyboardTriggerData, SHORTCUT_KEYS_MAPPINGS } from 'src/app/shared/models/action-trigger'
import { Tv2PartAction } from 'src/app/shared/models/tv2-action'
import { ActionTriggerService } from 'src/app/shared/abstractions/action-trigger.service'
import { IconButton, IconButtonSize } from 'src/app/shared/enums/icon-button'
import { SofieSelectOptions } from 'src/app/shared/models/forms'
import { KeyEventType } from 'src/app/keyboard/value-objects/key-event-type'
import { ArgumentType } from 'src/app/shared/models/action'

@Component({
  selector: 'sofie-edit-action-triggers',
  templateUrl: './edit-action-triggers.component.html',
  styleUrls: ['./edit-action-triggers.component.scss'],
})
export class EditActionTriggersComponent implements OnChanges {
  @Output() public readonly cancelActionTrigger: EventEmitter<void> = new EventEmitter<void>()
  @Input() public selectedActionTrigger: ActionTriggerWithActionInfo<KeyboardAndSelectionTriggerData> | undefined
  @Input() public actions: Tv2PartAction[]
  private keyPress: boolean = false
  public mapToFocus: boolean = false
  public submitting: boolean = false
  public selectedAction: Tv2PartAction | undefined
  public keysLabel = $localize`action-triggers.shortcut.label`
  public physicalMappingLabel = $localize`action-triggers.physical-mapping.label`
  public triggerOnLabel = $localize`action-triggers.trigger-on.label`
  public selectedActionLabel = $localize`action-triggers.selected-action.label`
  public submitBtnTooltipError = $localize`action-triggers.submit-tooltip.error`
  public argumentType = ArgumentType
  public readonly iconButton = IconButton
  public readonly iconButtonSize = IconButtonSize
  public readonly triggerOnOptions: SofieSelectOptions[] = [
    { key: KeyEventType.PRESSED, label: $localize`global.on-key-pressed.label` },
    { key: KeyEventType.RELEASED, label: $localize`global.on-key-released.label` },
  ]
  constructor(
    private readonly fb: FormBuilder,
    private readonly actionTriggerService: ActionTriggerService
  ) {}

  public actionForm: UntypedFormGroup = this.fb.group({
    actionId: ['', [Validators.required]],
    data: this.fb.group({
      keys: this.fb.array([], [Validators.required]),
      actionArguments: [''],
      label: [''],
      triggerOn: [KeyEventType.RELEASED, [Validators.required]],
      mappedToKeys: this.fb.array([]),
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
    const action: ActionTriggerWithActionInfo<KeyboardAndSelectionTriggerData> | undefined = actionTriggerChange.currentValue
    this.clearFormArray(this.formKeysArray)
    this.clearFormArray(this.formMappedToKeysArray)
    if (action) {
      this.patchValue(action)
      this.selectedAction = action.actionInfo
    } else {
      this.customFromReset()
      this.selectedAction = undefined
    }
    this.checkActionAndSetValidators()
  }

  private customFromReset(): void {
    this.actionForm.reset()
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

  private patchValue(actionValue: ActionTrigger<KeyboardAndSelectionTriggerData>): void {
    this.actionForm.patchValue(actionValue)
    this.addArrValues(actionValue.data.keys, this.formKeysArray)
  }

  private clearFormArray(formArray: UntypedFormArray): void {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

  public onKeyDownShortcut(event: KeyboardEvent): void {
    event.preventDefault()
    const newKeyCode: string = SHORTCUT_KEYS_MAPPINGS[event.code] ? SHORTCUT_KEYS_MAPPINGS[event.code] : event.code
    if (!this.keyPress) {
      this.clearFormArray(this.formKeysArray)
      this.createKey(newKeyCode, this.formKeysArray)
      this.keyPress = true
      return
    }
    const currentKeys: string[] = this.formKeysArray?.value ? this.formKeysArray?.value : []
    if (currentKeys.findIndex(keyCode => keyCode === newKeyCode) === -1) {
      this.createKey(newKeyCode, this.formKeysArray)
    }
  }

  public onKeyDownMapTo(event: KeyboardEvent): void {
    event.preventDefault()
    if (this.mapToFocus) {
      this.mapToFocus = false
      this.clearFormArray(this.formMappedToKeysArray)
    }
    const newKeyCode: string = SHORTCUT_KEYS_MAPPINGS[event.code] ? SHORTCUT_KEYS_MAPPINGS[event.code] : event.code

    const currentKeys: string[] = this.formMappedToKeysArray?.value ? this.formMappedToKeysArray?.value : []
    if (currentKeys.findIndex(keyCode => keyCode === newKeyCode) === -1) {
      this.createKey(newKeyCode, this.formMappedToKeysArray)
    }
  }
  public deleteMapToData(): void {
    this.clearFormArray(this.formMappedToKeysArray)
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

  public selectNewActionTrigger(action: Tv2PartAction): void {
    this.actionForm.patchValue({ actionId: action.id })
    this.selectedAction = action
    this.control('actionArguments', 'data').patchValue('')
    this.checkActionAndSetValidators()
  }

  public onKeyUpShortcut(): void {
    this.keyPress = false
  }

  public get isUpdateAction(): boolean {
    return !!this.selectedActionTrigger && !!this.selectedActionTrigger.id
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
    const actionTriggerValue: CreateActionTrigger<KeyboardTriggerData> = this.prepareSendData(this.actionForm.value)
    if (this.isUpdateAction) {
      this.updateActionTrigger({ ...actionTriggerValue, id: this.selectedActionTrigger?.id as string })
    } else {
      this.createActionTrigger(actionTriggerValue)
    }
  }

  private prepareSendData(formData: CreateActionTrigger<KeyboardTriggerData>): CreateActionTrigger<KeyboardTriggerData> {
    const resultData: CreateActionTrigger<KeyboardTriggerData> = { ...formData }
    if (this.selectedAction?.argument) {
      resultData.data.actionArguments = formData?.data?.actionArguments && this.selectedAction?.argument.type === ArgumentType.NUMBER ? +formData?.data?.actionArguments : formData.data.actionArguments
    } else {
      delete resultData.data.actionArguments
    }
    return resultData
  }

  private createActionTrigger(actionTrigger: CreateActionTrigger<KeyboardTriggerData>): void {
    this.actionTriggerService.createActionTrigger(actionTrigger).subscribe({
      next: () => {
        this.clearFormArray(this.formKeysArray)
        this.customFromReset()
        this.selectedAction = undefined
        this.checkActionAndSetValidators()
        this.submitting = false
      },
    })
  }

  private updateActionTrigger(actionTrigger: ActionTrigger<KeyboardTriggerData>): void {
    this.actionTriggerService.updateActionTrigger(actionTrigger).subscribe({
      next: () => {
        this.submitting = false
      },
    })
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
