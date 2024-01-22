import { Component, Input } from '@angular/core'
import { ActionTrigger, ActionTriggerWithAction } from 'src/app/shared/models/action-trigger'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ActionTriggerParser } from 'src/app/shared/abstractions/action-trigger-parser.service'
import { ActionTriggerService } from 'src/app/shared/abstractions/action-trigger.service'
import { KeyboardTriggerData } from 'src/app/shared/models/keyboard-trigger'

@Component({
  selector: 'sofie-action-triggers-import',
  templateUrl: './action-triggers-import.component.html',
  styleUrls: ['./action-triggers-import.component.scss'],
})
export class ActionTriggersImportComponent {
  @Input() public actionTriggersWithAction: ActionTriggerWithAction<KeyboardTriggerData>[]
  @Input() public isDisabled: boolean
  private importedActionTriggers: ActionTrigger<KeyboardTriggerData>[]

  constructor(
    private readonly actionTriggerService: ActionTriggerService,
    private readonly actionTriggerParser: ActionTriggerParser,
    private readonly snackBar: MatSnackBar
  ) {}

  public uploadFile(inputElement: HTMLInputElement): void {
    const files = inputElement.files
    if (!files?.[0]) {
      this.openDangerSnackBar('Error in imported file')
      return
    }
    const reader = new FileReader()
    reader.onload = (readerProcessEvent: ProgressEvent<FileReader>): void => {
      try {
        const importedActionTriggers: ActionTrigger<KeyboardTriggerData>[] = this.actionTriggerParser.parseActionTriggers(
          JSON.parse(readerProcessEvent?.target?.result ? readerProcessEvent.target.result.toString() : '')
        )
        if (importedActionTriggers.length === 0) {
          this.openDangerSnackBar('No items to be added')
          return
        }
        this.importedActionTriggers = importedActionTriggers
        this.importItem(0)
      } catch {
        this.openDangerSnackBar('Error in imported file')
      }
      inputElement.value = ''
    }
    reader.readAsText(files[0])
  }

  private hasNoImportedActionTriggerAfterIndex(index: number): boolean {
    return index + 1 > this.importedActionTriggers.length
  }

  private importItem(index: number): void {
    if (this.actionTriggersWithAction.findIndex(actionTriggerWithAction => actionTriggerWithAction.actionTrigger.id === this.importedActionTriggers[index].id) !== -1) {
      this.updateActionTrigger(this.importedActionTriggers[index], index)
    } else {
      this.createActionTrigger(this.importedActionTriggers[index], index)
    }
  }

  private createActionTrigger(actionTrigger: ActionTrigger<KeyboardTriggerData>, index: number): void {
    this.actionTriggerService.createActionTrigger(actionTrigger).subscribe()
    if (!this.hasNoImportedActionTriggerAfterIndex(index)) {
      this.importItem(index + 1)
    }
  }

  private updateActionTrigger(actionTrigger: ActionTrigger<KeyboardTriggerData>, index: number): void {
    this.actionTriggerService.updateActionTrigger(actionTrigger).subscribe()
    if (!this.hasNoImportedActionTriggerAfterIndex(index)) {
      this.importItem(index + 1)
    }
  }

  private openDangerSnackBar(message: string): void {
    this.snackBar.open(message, $localize`global.dismiss.label`, { panelClass: 'snackbar-danger' })
  }
}
