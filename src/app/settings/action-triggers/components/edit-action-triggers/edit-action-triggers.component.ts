import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange, SimpleChanges } from '@angular/core'
import { AbstractControl, FormBuilder, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms'
import { ActionTrigger, ActionTriggerWithActionInfo, CreateActionTrigger, KeyboardAndSelectionTriggerData, KeyboardTriggerData, SHORTCUT_KEYS_MAPPINGS } from 'src/app/shared/models/action-trigger'
import { Tv2PartAction } from 'src/app/shared/models/tv2-action'
import { ActionTriggerService } from 'src/app/shared/abstractions/action-trigger.service'

export interface ActionTriggerUIForm {
  actionId: string
  data: {
    label: string
    keys: string[]
    actionArguments: number
  }
}

@Component({
  selector: 'sofie-edit-action-triggers',
  templateUrl: './edit-action-triggers.component.html',
  styleUrls: ['./edit-action-triggers.component.scss'],
})
export class EditActionTriggersComponent implements OnChanges {
  @Output() private readonly cancelActionTrigger: EventEmitter<void> = new EventEmitter<void>()
  @Input() public selectedActionTrigger: ActionTriggerWithActionInfo<KeyboardAndSelectionTriggerData> | null
  @Input() public actions: Tv2PartAction[]
  public submitting: boolean = false
  public submitted: boolean = false
  public keyPress: boolean = false
  public selectedAction: Tv2PartAction | null

  constructor(
    private readonly fb: FormBuilder,
    private readonly actionTriggerService: ActionTriggerService
  ) {}

  public actionForm: UntypedFormGroup = this.fb.group({
    actionId: ['', [Validators.required]],
    data: this.fb.group({
      keys: this.fb.array([]),
      actionArguments: '',
      label: [''],
    }),
  })

  public ngOnChanges(changes: SimpleChanges): void {
    const actionTriggerChange: SimpleChange | undefined = changes['selectedActionTrigger']
    if (actionTriggerChange) {
      const action: ActionTriggerWithActionInfo<KeyboardAndSelectionTriggerData> | null = actionTriggerChange.currentValue
      this.clearFormArray(this.attributesArray)
      if (action) {
        this.patchValue(action)
        this.selectedAction = action.actionInfo
      } else {
        this.actionForm.reset()
        this.selectedAction = null
      }
    }
  }

  private patchValue(actionValue: ActionTrigger<KeyboardAndSelectionTriggerData>): void {
    this.actionForm.patchValue(actionValue)
    this.addArrValues(actionValue.data.keys, this.attributesArray)
  }

  private clearFormArray(formArray: UntypedFormArray): void {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

  public onKeyDown(event: KeyboardEvent): void {
    event.preventDefault()
    const newKeyCode: string = SHORTCUT_KEYS_MAPPINGS[event.code] ? SHORTCUT_KEYS_MAPPINGS[event.code] : event.code
    if (this.keyPress) {
      const currentKeys: string[] = this.actionForm?.get('data')?.get('keys')?.value ? this.actionForm?.get('data')?.get('keys')?.value : []
      if (currentKeys.findIndex(keyCode => keyCode === newKeyCode) === -1) {
        currentKeys.push(newKeyCode)
        this.createKey(newKeyCode, this.attributesArray)
      }
    } else {
      this.clearFormArray(this.attributesArray)
      this.createKey(newKeyCode, this.attributesArray)
      this.keyPress = true
    }
  }

  private get attributesArray(): UntypedFormArray {
    return this.actionForm?.get('data')?.get('keys') as UntypedFormArray
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
  }

  public onKeyUp(): void {
    this.keyPress = false
  }

  public get isUpdateAction(): boolean {
    return !!this.selectedActionTrigger && !!this.selectedActionTrigger.id
  }

  public submit(): void {
    this.submitted = true
    if (this.actionForm.invalid) {
      this.actionForm.markAllAsTouched()
      return
    }
    this.submitting = true
    const actionTriggerValue = this.prepareSendData(this.actionForm.value)
    if (this.isUpdateAction) {
      this.updateActionTrigger({ ...actionTriggerValue, id: this.selectedActionTrigger?.id as string })
    } else {
      this.createActionTrigger(actionTriggerValue)
    }
  }

  private prepareSendData(formData: ActionTriggerUIForm): CreateActionTrigger<KeyboardTriggerData> {
    const keysArray: string[] = formData.data?.keys
    const resultData: CreateActionTrigger<KeyboardTriggerData> = {
      actionId: formData.actionId,
      data: { keys: keysArray, label: formData.data.label ? formData.data.label : (this.selectedAction as Tv2PartAction).name },
    }
    if (this.selectedAction?.argument) {
      resultData.data.actionArguments = +formData.data.actionArguments
    }
    return resultData
  }

  private createActionTrigger(actionTrigger: CreateActionTrigger<KeyboardTriggerData>): void {
    this.actionTriggerService.createActionTrigger(actionTrigger).subscribe({
      next: () => {
        this.clearFormArray(this.attributesArray)
        this.actionForm.reset()
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

  public cancelEdit(): void {
    this.cancelActionTrigger.emit()
  }

  public control(name: string): AbstractControl {
    return this.actionForm.controls[name]
  }

  public showErrorFor(name: string, groupName?: string): boolean | undefined {
    if (!!groupName) {
      return this.actionForm.get(groupName)?.get(name)?.invalid && this.actionForm.get(groupName)?.get(name)?.touched
    } else {
      return this.control(name).invalid && this.control(name).touched
    }
  }
}
