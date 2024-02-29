import { lastValueFrom } from 'rxjs'
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

  public readonly importShortcutLabel = $localize`action-triggers.import-shortcuts.button`

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
        this.importActionTriggers(importedActionTriggers).catch(() => {
          this.openDangerSnackBar('Error in imported file')
        })
      } catch {
        this.openDangerSnackBar('Error in imported file')
      }
      inputElement.value = ''
    }
    reader.readAsText(files[0])
  }

  private async importActionTriggers(actionTriggersToImport: ActionTrigger<KeyboardTriggerData>[]): Promise<void> {
    await Promise.all(actionTriggersToImport.map(this.importActionTrigger.bind(this)))
  }

  private importActionTrigger(actionTriggerToImport: ActionTrigger<KeyboardTriggerData>): Promise<void> {
    return lastValueFrom(
      this.actionTriggersWithAction.some(actionTriggerWithAction => actionTriggerWithAction.actionTrigger.id === actionTriggerToImport.id)
        ? this.actionTriggerService.updateActionTrigger(actionTriggerToImport)
        : this.actionTriggerService.createActionTrigger(actionTriggerToImport)
    )
  }

  private openDangerSnackBar(message: string): void {
    this.snackBar.open(message, $localize`global.dismiss.label`, { panelClass: 'snackbar-danger' })
  }
}
