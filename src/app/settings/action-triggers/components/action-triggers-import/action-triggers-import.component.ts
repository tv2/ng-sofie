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
  @Input() public actionsTriggersList: ActionTriggerWithActionInfo<KeyboardAndSelectionTriggerData>[]
  @Input() public disabled: boolean
  private importedActionsTriggersList: ActionTrigger<KeyboardAndSelectionTriggerData>[]

  constructor(
    private readonly actionTriggerService: ActionTriggerService,
    private readonly actionTriggerParser: ActionTriggerParser,
    private readonly snackBar: MatSnackBar
  ) {}

  public fileUpload(event: Event, htmlInput: HTMLInputElement): void {
    const files = (event.target as HTMLInputElement).files
    if (files && files[0]) {
      const reader = new FileReader()
      // eslint-disable-next-line
      reader.onload = (e: any): void => {
        try {
          const importedActionTriggersList: ActionTrigger<KeyboardAndSelectionTriggerData>[] = this.actionTriggerParser.parseActionTriggers(JSON.parse(e.target.result))
          if (importedActionTriggersList.length > 0) {
            this.importedActionsTriggersList = importedActionTriggersList
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
  }

  private hasNoImportedActionTriggerAfterIndex(index: number): boolean {
    return index + 1 > this.importedActionsTriggersList.length
  }

  private importItem(index: number): void {
    if (this.actionsTriggersList.findIndex(item => item.id === this.importedActionsTriggersList[index].id) !== -1) {
      this.updateActionTrigger(this.importedActionsTriggersList[index] as ActionTrigger<KeyboardTriggerData>, index)
    } else {
      this.createActionTrigger(this.importedActionsTriggersList[index] as CreateActionTrigger<KeyboardTriggerData>, index)
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
