import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { KeyBinding } from 'src/app/keyboard/value-objects/key-binding'
import { ActionArgumentSchemaType } from '../../../../shared/models/action'
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms'
import { KeyEventType } from '../../../../keyboard/value-objects/key-event-type'
import { KeyboardMapping } from '../keyboard-mapping-settings-page/keyboard-mapping-settings-page.component'
import { Tv2Action, Tv2PartAction } from '../../../../shared/models/tv2-action'
import { SelectOption } from '../../../../shared/models/select-option'
import { Icon, IconSize } from '../../../../shared/enums/icon'

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

  public isKeyboardVisible = false
  protected readonly Icon = Icon
  protected readonly IconSize = IconSize

  public keystrokes: string[] = []
  public keyBindings: KeyBinding[] = []

  public actionTriggerForm: FormGroup
  public actionTriggerDataForm: FormGroup

  public triggerOnOptions: SelectOption<KeyEventType>[] = []

  public selectedAction?: Tv2Action

  constructor(private readonly formBuilder: NonNullableFormBuilder) {}

  public ngOnInit(): void {
    this.initializeForms()
    this.setupTriggerOnOptions()

    if (this.keyboardMapping) {
      this.selectAction(this.keyboardMapping.action!)
    }
  }

  private initializeForms(): void {
    this.actionTriggerDataForm = this.formBuilder.group({
      label: this.formBuilder.control<string>(this.keyboardMapping?.actionTrigger.data.label ?? ''),
      keys: this.formBuilder.control<string[] | undefined>(this.keyboardMapping?.actionTrigger.data.keys, [Validators.required]),
      overrideColor: this.formBuilder.control<string>(this.keyboardMapping?.actionTrigger.data.overrideColor ?? ''),
      triggerOn: this.formBuilder.control<KeyEventType>(KeyEventType.RELEASED, [Validators.required]),
      mappedToKeys: this.formBuilder.control<string[]>(this.keyboardMapping?.actionTrigger.data.mappedToKeys ?? []),
    })

    this.actionTriggerForm = this.formBuilder.group({
      actionId: ['', [Validators.required]],
      data: this.actionTriggerDataForm,
    })
  }

  private setupTriggerOnOptions(): void {
    this.triggerOnOptions = Object.values(KeyEventType).map(keyEventType => {
      return {
        name: keyEventType.toString(),
        value: keyEventType,
      }
    })
  }

  public toggleKeyboardVisibility(): void {
    this.isKeyboardVisible = !this.isKeyboardVisible
  }

  public updateKeys($keys: string[]): void {
    var currentValue: string[] = this.actionTriggerDataForm.get('keys')?.value ?? []

    $keys.forEach(item => {
      if (!currentValue.includes(item)) {
        this.actionTriggerDataForm.get('keys')?.setValue([...currentValue, item])
      }
    })
  }

  public selectAction(action: Tv2Action): void {
    this.selectedAction = action

    this.actionTriggerForm.patchValue({
      actionId: action.id,
    })

    this.doesSelectedActionHaveActionArguments() ? this.addActionArgumentsFormControl() : this.removeActionArgumentsFormControl()
  }

  private addActionArgumentsFormControl(): void {
    this.actionTriggerDataForm.setControl(KEYBOARD_ACTION_ARGUMENTS_CONTROL_ID, this.formBuilder.control(this.keyboardMapping?.actionTrigger.data.actionArguments, Validators.required))
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

  public saveAndRemainOpen(): void {
    const editKeyboardMappingResponse: EditKeyboardMappingResponse = {
      keyboardMapping: this.createEditKeyboardMapping(),
      shouldClose: false,
    }

    this.onSave.emit(editKeyboardMappingResponse)
  }

  public saveAndClose(): void {
    const editKeyboardMappingResponse: EditKeyboardMappingResponse = {
      keyboardMapping: this.createEditKeyboardMapping(),
      shouldClose: true,
    }

    this.onSave.emit(editKeyboardMappingResponse)
  }

  private createEditKeyboardMapping(): KeyboardMapping {
    var formValues = this.actionTriggerForm.getRawValue()

    return {
      action: {} as Tv2PartAction,
      actionTrigger: {
        ...this.keyboardMapping?.actionTrigger,
        ...formValues,
      },
    }
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
    return Object.entries({ ...this.actionTriggerForm.controls, ...this.actionTriggerDataForm.controls })
      .filter(([controlId, control]) => !control.valid && controlId !== KEYBOARD_DATA_CONTROL_ID)
      .map(([controlId]) => this.translateControl(controlId))
  }

  private translateControl(controlId: string): string {
    switch (controlId) {
      case KEYBOARD_TRIGGER_ON_CONTROL_ID:
        return $localize`action-triggers.trigger-on.label`
      case KEYBOARD_KEYS_CONTROL_ID:
        return $localize`action-triggers.shortcut.label`
      case KEYBOARD_ACTION_CONTROL_ID:
        return $localize`action-triggers.action.label`
      case KEYBOARD_ACTION_ARGUMENTS_CONTROL_ID:
        return this.selectedAction?.argument?.name!
      default:
        return controlId
    }
  }

  public get selectedActionErrorMessage(): string {
    return $localize`${this.selectedAction?.argument?.name} action-triggers.action-arguments.error`
  }
}
