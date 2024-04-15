import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ActionArgumentSchemaType } from '../../../../shared/models/action'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { KeyEventType } from '../../../../keyboard/value-objects/key-event-type'
import { KeyboardMapping } from '../keyboard-mapping-settings-page/keyboard-mapping-settings-page.component'
import { Tv2Action, Tv2PartAction } from '../../../../shared/models/tv2-action'
import { SelectOption } from '../../../../shared/models/select-option'

const KEYBOARD_ACTION_CONTROL_ID: string = 'actionId'
const KEYBOARD_KEYS_CONTROL_ID: string = 'keys'
const KEYBOARD_TRIGGER_ON_CONTROL_ID: string = 'triggerOn'
const KEYBOARD_ACTION_ARGUMENTS_CONTROL_ID: string = 'actionArguments'
const KEYBOARD_DATA_CONTROL_ID: string = 'data'

export interface EditKeyboardMappingResponse {
  keyboardMapping: KeyboardMapping
  shouldClose: boolean
}

@Component({
  selector: 'sofie-edit-keyboard-mapping',
  templateUrl: './edit-keyboard-mapping.component.html',
  styleUrls: ['./edit-keyboard-mapping.component.scss'],
})
export class EditKeyboardMappingComponent implements OnInit {
  protected readonly ActionArgumentSchemaType = ActionArgumentSchemaType

  @Input() public keyboardMapping?: KeyboardMapping

  @Output() public onSave: EventEmitter<EditKeyboardMappingResponse> = new EventEmitter()
  @Output() public onCancel: EventEmitter<void> = new EventEmitter()

  public actionTriggerForm: FormGroup
  public actionTriggerDataForm: FormGroup

  public triggerOnOptions: SelectOption<KeyEventType>[] = []

  public selectedAction?: Tv2Action

  constructor(private readonly formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.actionTriggerDataForm = this.formBuilder.group({
      label: [this.keyboardMapping?.actionTrigger.data.label ?? ''],
      keys: [this.keyboardMapping?.actionTrigger.data.keys, [Validators.required]],
      triggerOn: [KeyEventType.RELEASED, [Validators.required]],
      mappedToKeys: [this.keyboardMapping?.actionTrigger.data.mappedToKeys ?? []],
    })

    this.actionTriggerForm = this.formBuilder.group({
      actionId: ['', [Validators.required]],
      data: this.actionTriggerDataForm,
    })

    this.triggerOnOptions = Object.values(KeyEventType).map(keyEventType => {
      return {
        name: keyEventType.toString(),
        value: keyEventType,
      }
    })

    if (this.keyboardMapping) {
      this.selectAction(this.keyboardMapping.action!)
    }
  }

  public selectAction(action: Tv2Action): void {
    this.selectedAction = action

    this.actionTriggerForm.patchValue({
      actionId: action.id,
    })

    this.doesSelectedActionHaveActionArguments() ? this.addActionArgumentsFormControl() : this.removeActionArgumentsFormControl()
  }

  private addActionArgumentsFormControl(): void {
    this.actionTriggerDataForm.setControl(KEYBOARD_ACTION_ARGUMENTS_CONTROL_ID, this.formBuilder.nonNullable.control(this.keyboardMapping?.actionTrigger.data.actionArguments, Validators.required))
  }

  private removeActionArgumentsFormControl(): void {
    this.actionTriggerDataForm.removeControl(KEYBOARD_ACTION_ARGUMENTS_CONTROL_ID)
  }

  public doesSelectedActionHaveActionArguments(): boolean {
    return !!this.selectedAction?.argument
  }

  public getSelectedActionArgumentType(): ActionArgumentSchemaType | undefined {
    if (!this.selectedAction?.argument) {
      return
    }
    return this.selectedAction.argument.type
  }

  public save(shouldClose: boolean): void {
    const editKeyboardMappingResponse: EditKeyboardMappingResponse = {
      keyboardMapping: {
        action: {} as Tv2PartAction,
        actionTrigger: {
          ...this.keyboardMapping?.actionTrigger,
          ...this.actionTriggerForm.value,
        },
      },
      shouldClose,
    }

    this.onSave.emit(editKeyboardMappingResponse)
  }

  public cancel(): void {
    this.onCancel.emit()
  }

  public get saveButtonErrorsTooltip(): string | undefined {
    const invalidControlsLabels: string[] = this.findInvalidControlsLabels()
    if (invalidControlsLabels.length > 0) {
      return $localize`common.form-required-field.button-tooltip` + `: ${invalidControlsLabels.join(', ')}`
    } else {
      return undefined
    }
  }

  private findInvalidControlsLabels(): string[] {
    return Object.entries({ ...this.actionTriggerForm.controls, ...this.actionTriggerDataForm.controls })
      .filter(([name, control]) => !control.valid && name !== KEYBOARD_DATA_CONTROL_ID)
      .map(([name]) => this.translateControl(name))
  }

  private translateControl(controlName: string): string {
    switch (controlName) {
      case KEYBOARD_TRIGGER_ON_CONTROL_ID:
        return $localize`action-triggers.trigger-on.label`
      case KEYBOARD_KEYS_CONTROL_ID:
        return $localize`action-triggers.shortcut.label`
      case KEYBOARD_ACTION_CONTROL_ID:
        return $localize`action-triggers.action.label`
      case KEYBOARD_ACTION_ARGUMENTS_CONTROL_ID:
        return this.selectedAction?.argument?.name!
      default:
        return controlName
    }
  }

  public get selectedActionErrorMessage(): string {
    return $localize`${this.selectedAction?.argument?.name} action-triggers.action-arguments.error`
  }
}
