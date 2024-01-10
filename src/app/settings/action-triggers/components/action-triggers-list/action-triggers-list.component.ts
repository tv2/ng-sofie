import { Component, EventEmitter, Input, Output } from '@angular/core'
import { IconButton, IconButtonSize } from 'src/app/shared/enums/icon-button'
import {
  ActionTriggerSortKeys,
  ActionTriggerWithActionInfo,
  CreateActionTrigger,
  KeyboardAndSelectionTriggerData,
  KeyboardTriggerData,
  UserActionsWithSelectedTriggers,
} from 'src/app/shared/models/action-trigger'
import { SofieDroppdownOptions } from 'src/app/shared/components/dropdown-button/dropdown-button.component'
import { FilesUtil } from 'src/app/helper/files.util'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { CopyUtil } from 'src/app/helper/copy.util'
import { ActionTriggerService } from 'src/app/shared/abstractions/action-trigger.service'

@Component({
  selector: 'sofie-action-triggers-list',
  templateUrl: './action-triggers-list.component.html',
  styleUrls: ['./action-triggers-list.component.scss'],
})
export class ActionTriggersListComponent {
  @Input() public actionsTriggersList: ActionTriggerWithActionInfo<KeyboardAndSelectionTriggerData>[]
  @Input() public selectedActionTrigger: ActionTriggerWithActionInfo<KeyboardAndSelectionTriggerData> | null
  @Input() public sort: ActionTriggerSortKeys
  @Output() private readonly actionTriggerSelect: EventEmitter<ActionTriggerWithActionInfo<KeyboardAndSelectionTriggerData> | null> =
    new EventEmitter<ActionTriggerWithActionInfo<KeyboardAndSelectionTriggerData> | null>()
  @Output() private readonly newSortSelect: EventEmitter<ActionTriggerSortKeys> = new EventEmitter<ActionTriggerSortKeys>()
  public search: string = ''
  public sortLabel: string = $localize`global.sort.label`
  public readonly IconButton = IconButton
  public readonly IconButtonSize = IconButtonSize
  public readonly sortActionsTriggers: SofieDroppdownOptions[] = [
    { key: ActionTriggerSortKeys.ACTION_ID_A_Z, label: $localize`action-triggers-sort.action-id-a-z.label` },
    { key: ActionTriggerSortKeys.ACTION_ID_Z_A, label: $localize`action-triggers-sort.action-id-z-a.label` },
    { key: ActionTriggerSortKeys.SHORTCUT_A_Z, label: $localize`action-triggers-sort.shortcut-a-z.label` },
    { key: ActionTriggerSortKeys.SHORTCUT_Z_A, label: $localize`action-triggers-sort.shortcut-z-a.label` },
  ]

  public readonly selectedTriggersOptions: SofieDroppdownOptions[] = [
    { key: UserActionsWithSelectedTriggers.DISABLE_SELECTION, label: `Disable multi selection`, disabled: false },
    { key: UserActionsWithSelectedTriggers.TOGGLE_SELECT, label: $localize`global.select-all.label`, disabled: false },
    { key: UserActionsWithSelectedTriggers.EXPORT, label: $localize`action-triggers-sort.export-selected.label`, disabled: true },
    { key: UserActionsWithSelectedTriggers.DELETE, label: $localize`action-triggers.delete-selected.label`, disabled: true },
  ]
  public selectedCount: number = 0
  public selectMode: boolean = false

  constructor(
    private readonly dialogService: DialogService,
    private readonly actionTriggerService: ActionTriggerService
  ) {}

  get filteredActionsTriggers(): ActionTriggerWithActionInfo<KeyboardAndSelectionTriggerData>[] {
    return this.actionsTriggersList.filter(
      trigger =>
        trigger.actionId.toLocaleLowerCase().includes(this.search.toLocaleLowerCase()) ||
        trigger.data.keys.toString().toLocaleLowerCase().includes(this.search.toLocaleLowerCase()) ||
        trigger.id === this.selectedActionTrigger?.id
    )
  }

  public selectActionTrigger(actionTrigger: ActionTriggerWithActionInfo<KeyboardAndSelectionTriggerData> | null): void {
    if (this.selectedActionTrigger?.id === actionTrigger?.id) {
      this.actionTriggerSelect.emit(null)
    } else {
      this.actionTriggerSelect.emit(actionTrigger)
    }
  }

  public actionTriggerCheckToggle(isSelected: boolean, index: number): void {
    this.actionsTriggersList[index].data.selected = isSelected
    this.checkSelectedCount()
  }

  public enableMultiSelect(): void {
    this.dialogService.createConfirmDialog(
      `Confirm`,
      `Starting multi selection option, you will be able to select a miltiple action triggers to export or delete`,
      'Proceed',
      () => (this.selectMode = true)
    )
  }

  public actionTriggerDelete(actionTriggerId: string): void {
    this.dialogService.createConfirmDialog($localize`global.delete.label`, $localize`action-triggers.delete.confirmation`, 'Delete', () => this.deleteActionTriggerById(actionTriggerId))
  }

  private deleteActionTriggerById(actionTriggerId: string, deleteAllSelected?: boolean): void {
    if (deleteAllSelected) {
      for (let deleteActionTrigger of this.selectedActionTriggers) {
        this.actionTriggerService.deleteActionTrigger(deleteActionTrigger.id).subscribe()
      }
    } else {
      this.actionTriggerService.deleteActionTrigger(actionTriggerId).subscribe()
    }
  }

  public actionTriggerCopy(actionTrigger: ActionTriggerWithActionInfo<KeyboardAndSelectionTriggerData>): void {
    const copyPayload: CreateActionTrigger<KeyboardTriggerData> = {
      actionId: actionTrigger.actionId,
      data: { keys: actionTrigger.data.keys, label: actionTrigger.data.label, actionArguments: actionTrigger.data.actionArguments as number },
    }
    this.actionTriggerService.createActionTrigger(copyPayload).subscribe()
  }

  public selectNewSort(sortOption: string): void {
    this.newSortSelect.emit(sortOption as ActionTriggerSortKeys)
  }

  public actionWithSelected(userAction: string): void {
    if (userAction === UserActionsWithSelectedTriggers.DELETE) {
      this.dialogService.createConfirmDialog($localize`action-triggers.delete-selected.label`, $localize`action-triggers.delete-selected.confirmation`, 'Delete', () =>
        this.deleteActionTriggerById(this.selectedActionTriggers[0].id, true)
      )
    } else if (userAction === UserActionsWithSelectedTriggers.EXPORT) {
      this.exportSelectedTriggers()
    } else if (userAction === UserActionsWithSelectedTriggers.TOGGLE_SELECT) {
      this.toggleSelectUnselectAll()
    } else if (userAction === UserActionsWithSelectedTriggers.DISABLE_SELECTION) {
      this.selectMode = false
      this.unselectAllActionsTriggers()
      this.checkSelectedCount()
    }
  }

  private get selectedActionTriggers(): ActionTriggerWithActionInfo<KeyboardAndSelectionTriggerData>[] {
    return this.actionsTriggersList.filter(item => item.data.selected)
  }

  private checkSelectedCount(): void {
    this.selectedCount = this.actionsTriggersList.filter(item => item.data.selected).length
    const toggleSelectIndex = this.selectedTriggersOptions.findIndex(item => item.key === UserActionsWithSelectedTriggers.TOGGLE_SELECT)
    this.selectedTriggersOptions.forEach(option => {
      if (option.key === UserActionsWithSelectedTriggers.TOGGLE_SELECT) {
        if (this.selectedCount === this.actionsTriggersList.length) {
          this.selectedTriggersOptions[toggleSelectIndex].label = $localize`global.unselect-all.label`
        } else {
          this.selectedTriggersOptions[toggleSelectIndex].label = $localize`global.select-all.label`
        }
      }
      if (option.key === UserActionsWithSelectedTriggers.EXPORT || option.key === UserActionsWithSelectedTriggers.DELETE) {
        if (this.selectedCount > 0) {
          option.disabled = false
        } else {
          option.disabled = true
        }
      }
    })
  }

  private exportSelectedTriggers(): void {
    const triggersCopy: ActionTriggerWithActionInfo<KeyboardAndSelectionTriggerData>[] = CopyUtil.deepCopy(this.selectedActionTriggers)
    triggersCopy.map(trigger => {
      delete trigger.data.selected, trigger.actionInfo
      return trigger
    })
    FilesUtil.saveText(JSON.stringify(triggersCopy), 'selected-actions-triggers.json')
    this.unselectAllActionsTriggers()
    this.checkSelectedCount()
  }

  private toggleSelectUnselectAll(): void {
    if (this.selectedCount === this.actionsTriggersList.length) {
      this.unselectAllActionsTriggers()
    } else {
      this.selectAllActionsTriggers()
    }
    this.checkSelectedCount()
  }

  private unselectAllActionsTriggers(): void {
    this.selectedActionTriggers.forEach(trigger => (trigger.data.selected = false))
  }

  private selectAllActionsTriggers(): void {
    this.actionsTriggersList.forEach(trigger => (trigger.data.selected = true))
  }
}
