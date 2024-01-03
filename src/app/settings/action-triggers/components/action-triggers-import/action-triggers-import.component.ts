import { Component, EventEmitter, Input, Output } from '@angular/core'
import { ActionTrigger, EditActionsTriggers, KeyboardAndSelectionTriggerData } from 'src/app/shared/models/action-trigger'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ActionTriggerService } from 'src/app/shared/abstractions/action-trigger.service'
import { ActionTriggerParser } from 'src/app/shared/abstractions/action-trigger-parser.service'

@Component({
  selector: 'sofie-action-triggers-import',
  templateUrl: './action-triggers-import.component.html',
  styleUrls: ['./action-triggers-import.component.scss'],
})
export class ActionTriggersImportComponent {
  @Input() public actionsTriggersList: ActionTrigger<KeyboardAndSelectionTriggerData>[]
  @Input() public disabled: boolean
  @Output() private readonly startImport: EventEmitter<void> = new EventEmitter<void>()
  @Output() private readonly importFinish: EventEmitter<void> = new EventEmitter<void>()
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
            this.startImport.emit()
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

  private isHaveNextElement(index: number): boolean {
    return this.importedActionsTriggersList.length - 1 > index
  }

  private importItem(index: number): void {
    if (this.actionsTriggersList.findIndex(item => item.id === this.importedActionsTriggersList[index].id) !== -1) {
      this.updateActionTrigger(this.importedActionsTriggersList[index] as EditActionsTriggers, index)
    } else {
      this.createActionTrigger(this.importedActionsTriggersList[index] as EditActionsTriggers, index)
    }
  }

  private createActionTrigger(attribute: EditActionsTriggers, index: number): void {
    this.actionTriggerService.createActionTrigger(attribute).subscribe({
      next: () => {
        if (this.isHaveNextElement(index)) {
          this.importItem(index + 1)
        } else {
          this.importFinish.emit()
          this.openSnackBar('Import was successful')
        }
      },
      error: () => {
        this.openDangerSnackBar('Import fail')
      },
    })
  }

  private updateActionTrigger(attribute: EditActionsTriggers, index: number): void {
    this.actionTriggerService.updateActionTrigger(attribute).subscribe({
      next: () => {
        if (this.isHaveNextElement(index)) {
          this.importItem(index + 1)
        } else {
          this.importFinish.emit()
          this.openSnackBar('Import was successful')
        }
      },
      error: () => {
        this.openDangerSnackBar('Import fail')
      },
    })
  }

  private openSnackBar(message: string): void {
    this.snackBar.open(message, 'DISMISS', { panelClass: 'snackbar-success' })
  }

  private openDangerSnackBar(message: string): void {
    this.snackBar.open(message, 'DISMISS', { panelClass: 'snackbar-danger' })
  }
}
