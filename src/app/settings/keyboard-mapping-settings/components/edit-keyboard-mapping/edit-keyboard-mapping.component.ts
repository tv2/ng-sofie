import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ActionArgumentSchemaType } from '../../../../shared/models/action'
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { KeyEventType } from '../../../../keyboard/value-objects/key-event-type'
import { KeyboardMapping } from '../keyboard-mapping-settings-page/keyboard-mapping-settings-page.component'
import { Tv2Action, Tv2PartAction } from '../../../../shared/models/tv2-action'
import { SelectOption } from '../../../../shared/models/select-option'

const FORM_ACTION_CONTROL_LABEL: string = 'actionId'
const FORM_KEYS_CONTROL_LABEL: string = 'keys'
const FORM_TRIGGER_ON_CONTROL_LABEL: string = 'triggerOn'
const FORM_ACTION_ARGUMENTS_CONTROL_LABEL: string = 'actionArguments'

@Component({
  selector: 'sofie-edit-keyboard-mapping',
  templateUrl: './edit-keyboard-mapping.component.html',
  styleUrls: ['./edit-keyboard-mapping.component.scss'],
})
export class EditKeyboardMappingComponent implements OnInit {
  protected readonly ActionArgumentSchemaType = ActionArgumentSchemaType

  @Input() public keyboardMapping?: KeyboardMapping

  @Output() public onSave: EventEmitter<KeyboardMapping> = new EventEmitter()
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
      mappedToKeys: [this.keyboardMapping?.actionTrigger.data.mappedToKeys],
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
    this.actionTriggerDataForm.setControl(FORM_ACTION_ARGUMENTS_CONTROL_LABEL, this.formBuilder.nonNullable.control(this.keyboardMapping?.actionTrigger.data.actionArguments, Validators.required))
  }

  private removeActionArgumentsFormControl(): void {
    this.actionTriggerDataForm.removeControl(FORM_ACTION_ARGUMENTS_CONTROL_LABEL)
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

  public save(): void {
    const keyboardMapping: KeyboardMapping = {
      action: {} as Tv2PartAction,
      actionTrigger: {
        ...this.keyboardMapping?.actionTrigger,
        ...this.actionTriggerForm.value,
      },
    }

    this.onSave.emit(keyboardMapping)
  }

  public cancel(): void {
    this.onCancel.emit()
  }

  public get formValidationTooltip(): string | undefined {
    const invalidControls = this.findInvalidControls()
    return invalidControls.length > 0 ? $localize`common.form-required-field.button-tooltip` + `: ${invalidControls.join(', ')}` : undefined
  }

  private findInvalidControls(): string[] {
    const invalidControlLabels = []
    const controls = { ...this.actionTriggerForm.controls, ...this.actionTriggerDataForm.controls }
    for (const name in controls) {
      if (controls[name].valid) {
        continue
      }
      const translateControl = this.translateControl(name)
      if (translateControl) {
        invalidControlLabels.push(translateControl)
      }
    }
    return invalidControlLabels
  }

  private translateControl(controlName: string): string | undefined {
    switch (controlName) {
      case FORM_TRIGGER_ON_CONTROL_LABEL:
        return $localize`action-triggers.trigger-on.label`
      case FORM_KEYS_CONTROL_LABEL:
        return $localize`action-triggers.shortcut.label`
      case FORM_ACTION_CONTROL_LABEL:
        return $localize`action-triggers.action.label`
      case FORM_ACTION_ARGUMENTS_CONTROL_LABEL:
        return this.selectedAction?.argument?.name
      default:
        return undefined
    }
  }

  public checkControlForErrors(name: string, groupName?: string): boolean {
    const control = this.getFormControl(name, groupName)
    if (!!groupName) {
      return control ? control.invalid && control.touched : false
    } else {
      return control ? control.invalid && control.touched : false
    }
  }

  private getFormControl(name: string, groupName?: string): AbstractControl | undefined | null {
    if (!!groupName) {
      return this.actionTriggerForm.get(groupName)?.get(name)
    } else {
      return this.actionTriggerForm.controls[name]
    }
  }

  public get actionArgumentErrorMessage(): string {
    return $localize`${this.selectedAction?.argument?.name!} action-triggers.action-arguments.error`
  }
}
