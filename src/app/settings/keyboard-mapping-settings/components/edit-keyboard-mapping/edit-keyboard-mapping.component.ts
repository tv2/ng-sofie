import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ActionArgumentSchemaType } from '../../../../shared/models/action'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { KeyEventType } from '../../../../keyboard/value-objects/key-event-type'
import { KeyboardMapping } from '../keyboard-mapping-settings-page/keyboard-mapping-settings-page.component'
import { Tv2Action, Tv2PartAction } from '../../../../shared/models/tv2-action'
import { MultiSelectOption } from '../../../../shared/components/multi-select/multi-select.component'

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

  public triggerOnOptions: MultiSelectOption<KeyEventType>[] = []

  public selectedAction?: Tv2Action

  constructor(private readonly formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.actionTriggerDataForm = this.formBuilder.group({
      label: [this.keyboardMapping?.actionTrigger.data.label ?? ''],
      keys: [this.keyboardMapping?.actionTrigger.data.keys, [Validators.required]],
      triggerOn: [KeyEventType.RELEASED, [Validators.required]],
      mappedToKeys: [],
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
    this.actionTriggerDataForm.setControl('actionArguments', this.formBuilder.nonNullable.control(this.keyboardMapping?.actionTrigger.data.actionArguments, Validators.required))
  }

  private removeActionArgumentsFormControl(): void {
    this.actionTriggerDataForm.removeControl('actionArguments')
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
    this.keyboardMapping = {
      action: {} as Tv2PartAction,
      actionTrigger: {
        ...this.keyboardMapping?.actionTrigger,
        ...this.actionTriggerForm.value,
      },
    }

    this.onSave.emit(this.keyboardMapping)
  }

  public cancel(): void {
    this.onCancel.emit()
  }
}
