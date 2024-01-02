import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core'
import { AbstractControl, FormBuilder, UntypedFormGroup, Validators } from '@angular/forms'
import { ActionTrigger, EditActionsTriggers, KeyboardAndSelectionTriggerData } from 'src/app/shared/models/action-trigger'
import { ActionService } from 'src/app/shared/abstractions/action.service'
import { Tv2PartAction } from 'src/app/shared/models/tv2-action'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ActionTriggerService } from 'src/app/shared/abstractions/action-trigger.service'

export interface ActionTriggerUIForm {
  actionId: string
  data: {
    keys: string
    actionArguments: number
  }
}

@Component({
  selector: 'sofie-edit-action-triggers',
  templateUrl: './edit-action-triggers.component.html',
  styleUrls: ['./edit-action-triggers.component.scss'],
})
export class EditActionTriggersComponent implements OnChanges, OnInit {
  @Output() private readonly cancelActionTrigger: EventEmitter<void> = new EventEmitter<void>()
  @Output() private readonly editActionTrigger: EventEmitter<void> = new EventEmitter<void>()
  @Input() public selectedActionTrigger: ActionTrigger<KeyboardAndSelectionTriggerData> | null
  public submitting: boolean = false
  public submitted: boolean = false
  public actions: Tv2PartAction[]
  public loading: boolean = false
  public keyPress: boolean = false

  constructor(
    private readonly fb: FormBuilder,
    private readonly actionTriggerService: ActionTriggerService,
    private readonly actionService: ActionService,
    private readonly snackBar: MatSnackBar
  ) {}

  public actionForm: UntypedFormGroup = this.fb.group({
    actionId: ['', [Validators.required]],
    data: this.fb.group({
      keys: ['', [Validators.required]],
      actionArguments: '',
    }),
  })

  public ngOnChanges(changes: SimpleChanges): void {
    const actionChange: SimpleChange | undefined = changes['selectedActionTrigger']
    if (actionChange) {
      const action: ActionTrigger<KeyboardAndSelectionTriggerData> | null = actionChange.currentValue
      if (action) {
        this.patchValue(action)
      } else {
        this.actionForm.reset()
      }
    }
  }

  public ngOnInit(): void {
    this.loading = true
    this.actionService.getActions('jSXbtcsHTPjebGXurMzP401Z3u0_').subscribe({
      next: loadedActions => {
        this.actions = loadedActions as Tv2PartAction[]
        this.loading = false
      },
    })
  }

  private patchValue(actionValue: ActionTrigger<KeyboardAndSelectionTriggerData>): void {
    this.actionForm.patchValue({ actionId: actionValue.actionId, data: { keys: actionValue.data.keys.join(' + '), actionArguments: actionValue.data.actionArguments } })
  }

  public onKeyDown(event: KeyboardEvent): void {
    event.preventDefault()
    if (this.keyPress) {
      const currentKeys: string[] = this.actionForm?.get('data')?.get('keys')?.value ? this.actionForm?.get('data')?.get('keys')?.value.split(' + ') : []
      if (currentKeys.findIndex(keyCode => keyCode === event.code) === -1) {
        currentKeys.push(event.code)
        this.actionForm?.get('data')?.get('keys')?.patchValue(currentKeys.join(' + '))
      }
    } else {
      this.actionForm?.get('data')?.get('keys')?.patchValue(event.code)
      this.keyPress = true
    }
  }

  public selectNewActionTrigger(action: Tv2PartAction): void {
    this.actionForm.patchValue({ actionId: action.id })
  }

  public onKeyUp(): void {
    this.keyPress = false
  }

  public get isUpdateAction(): boolean {
    return !!this.selectedActionTrigger
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
      this.updateActionTrigger({ ...actionTriggerValue, id: this.selectedActionTrigger?.id })
    } else {
      this.createActionTrigger(actionTriggerValue)
    }
  }

  private prepareSendData(formData: ActionTriggerUIForm): EditActionsTriggers {
    const keysArray: string[] = formData.data?.keys?.split(' + ')
    const resultData: EditActionsTriggers = { actionId: formData.actionId, data: { keys: keysArray, actionArguments: +formData.data.actionArguments } }
    return resultData
  }

  private createActionTrigger(attribute: EditActionsTriggers): void {
    this.actionTriggerService.createActionTrigger(attribute).subscribe({
      next: () => {
        this.submitting = false
        this.editActionTrigger.emit()
        this.openSnackBar('Success create')
      },
      error: () => {
        this.submitting = false
        this.openDangerSnackBar('Fail to create')
      },
    })
  }

  private updateActionTrigger(attribute: EditActionsTriggers): void {
    this.actionTriggerService.updateActionTrigger(attribute).subscribe({
      next: () => {
        this.submitting = false
        this.editActionTrigger.emit()
        this.openSnackBar('Success update')
      },
      error: () => {
        this.submitting = false
        this.openDangerSnackBar('Fail to update')
      },
    })
  }

  private openSnackBar(message: string): void {
    this.snackBar.open(message, 'DISMISS', { panelClass: 'snackbar-success' })
  }

  private openDangerSnackBar(message: string): void {
    this.snackBar.open(message, 'DISMISS', { panelClass: 'snackbar-danger' })
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
