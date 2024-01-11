import { Component, Input } from '@angular/core'
import { ActionTrigger, ActionTriggerWithActionInfo, CreateActionTrigger, KeyboardAndSelectionTriggerData, KeyboardTriggerData } from 'src/app/shared/models/action-trigger'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ActionTriggerParser } from 'src/app/shared/abstractions/action-trigger-parser.service'
import { ActionTriggerService } from 'src/app/shared/abstractions/action-trigger.service'

@Component({
  selector: 'sofie-action-triggers-import',
  templateUrl: './action-triggers-import.component.html',
  styleUrls: ['./action-triggers-import.component.scss'],
})
export class ActionTriggersImportComponent {
  @Input() public actionTriggers: ActionTriggerWithActionInfo<KeyboardAndSelectionTriggerData>[]
  @Input() public disabled: boolean
  private importedActionTriggers: ActionTrigger<KeyboardAndSelectionTriggerData>[]

  constructor(
    private readonly actionTriggerService: ActionTriggerService,
    private readonly actionTriggerParser: ActionTriggerParser,
    private readonly snackBar: MatSnackBar
  ) {}

  public fileUpload(event: Event, htmlInput: HTMLInputElement): void {
    const files = (event.target as HTMLInputElement).files
    if (!files?.[0]) {
      this.openDangerSnackBar('Error in imported file')
      return
    }
    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>): void => {
      try {
        const importedActionTriggers: ActionTrigger<KeyboardAndSelectionTriggerData>[] = this.actionTriggerParser.parseActionTriggers(JSON.parse(e?.target?.result ? e.target.result.toString() : ''))
        if (importedActionTriggers.length > 0) {
          this.importedActionTriggers = importedActionTriggers
          this.importItem(0)
        } else {
          this.openDangerSnackBar('No items to be added')
        }
      } catch {
        this.openDangerSnackBar('Error in imported file')
      }
      htmlInput.value = ''
    }
    reader.readAsText(files[0])
  }

  private hasNoImportedActionTriggerAfterIndex(index: number): boolean {
    return index + 1 > this.importedActionTriggers.length
  }

  private importItem(index: number): void {
    if (this.actionTriggers.findIndex(item => item.id === this.importedActionTriggers[index].id) !== -1) {
      this.updateActionTrigger(this.importedActionTriggers[index], index)
    } else {
      this.createActionTrigger(this.importedActionTriggers[index], index)
    }
  }

  private createActionTrigger(actionTrigger: CreateActionTrigger<KeyboardTriggerData>, index: number): void {
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
    this.snackBar.open(message, 'DISMISS', { panelClass: 'snackbar-danger' })
  }
}
