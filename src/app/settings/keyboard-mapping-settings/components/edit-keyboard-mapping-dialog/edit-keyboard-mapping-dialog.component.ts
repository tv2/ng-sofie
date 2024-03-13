import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { KeyEventType } from '../../../../keyboard/value-objects/key-event-type'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MultiSelectOption } from '../../../../shared/components/multi-select/multi-select.component'
import { Tv2Action, Tv2PartAction } from '../../../../shared/models/tv2-action'
import { ActionArgumentSchemaType } from '../../../../shared/models/action'
import { KeyboardMapping } from '../keyboard-mapping-settings-page/keyboard-mapping-settings-page.component'

@Component({
  // There is no selector because this component is only allowed to be called through the DialogService.
  templateUrl: './edit-keyboard-mapping-dialog.component.html',
  styleUrls: ['edit-keyboard-mapping-dialog.component.scss'],
})
export class EditKeyboardMappingDialogComponent implements OnInit {
  protected readonly ActionArgumentSchemaType = ActionArgumentSchemaType

  protected readonly labelLabel: string = $localize`global.label`
  protected readonly shortcutLabel: string = $localize`action-triggers.shortcut.label`
  protected readonly physicalMappingLabel: string = $localize`action-triggers.physical-mapping.label`
  protected readonly physicalMappingHelpText: string = $localize`action-triggers.physical-mapping-help.tooltip`
  protected readonly triggerOnLabel: string = $localize`action-triggers.trigger-on.label`

  public actionTriggerForm: FormGroup
  public actionTriggerDataForm: FormGroup

  public triggerOnOptions: MultiSelectOption<KeyEventType>[] = []

  public selectedAction?: Tv2Action

  private keyboardMapping?: KeyboardMapping

  constructor(
    @Inject(MAT_DIALOG_DATA) keyboardMapping: KeyboardMapping,
    private readonly dialogRef: MatDialogRef<EditKeyboardMappingDialogComponent>,
    private readonly formBuilder: FormBuilder
  ) {
    this.keyboardMapping = keyboardMapping
  }

  public ngOnInit(): void {
    this.actionTriggerDataForm = this.formBuilder.group({
      label: [this.keyboardMapping?.actionTrigger.data.label ?? ''],
      keys: [this.keyboardMapping?.actionTrigger.data.keys, [Validators.required]],
      triggerOn: [KeyEventType.RELEASED, [Validators.required]],
      mappedToKeys: [[]],
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
      this.selectAction(this.keyboardMapping?.action!)
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
    return !!this.selectedAction && !!this.selectedAction.argument
  }

  public getSelectedActionArgumentType(): ActionArgumentSchemaType {
    return this.selectedAction!.argument!.type
  }

  public getTitle(): string {
    return this.keyboardMapping ? 'Edit Keyboard Mapping' : 'Create Keyboard Mapping'
  }

  public save(): void {
    this.keyboardMapping = {
      action: {} as Tv2PartAction,
      actionTrigger: {
        ...this.keyboardMapping?.actionTrigger,
        ...this.actionTriggerForm.value,
      },
    }

    this.dialogRef.close(this.keyboardMapping)
  }

  public cancel(): void {
    this.dialogRef.close()
  }
}
