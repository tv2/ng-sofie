import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { IconButton, IconButtonSize } from 'src/app/shared/enums/icon-button'
import {
  ActionTrigger,
  ActionTriggerSortKeys,
  ActionTriggerWithActionInfo,
  CreateActionTrigger,
  KeyboardAndSelectionTriggerData,
  KeyboardTriggerData,
  UserActionsWithSelectedTriggers,
} from 'src/app/shared/models/action-trigger'
import { SofieDroppdownOptions } from 'src/app/shared/components/dropdown-button/dropdown-button.component'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { ActionTriggerService } from 'src/app/shared/abstractions/action-trigger.service'
import { HttpFileDownloadService } from 'src/app/core/services/http/http-file-download.service'

@Component({
  selector: 'sofie-action-triggers-list',
  templateUrl: './action-triggers-list.component.html',
  styleUrls: ['./action-triggers-list.component.scss'],
})
export class ActionTriggersListComponent implements OnInit {
  @Input() public actionTriggers: ActionTriggerWithActionInfo<KeyboardAndSelectionTriggerData>[]
  @Input() public selectedActionTrigger: ActionTriggerWithActionInfo<KeyboardAndSelectionTriggerData> | undefined
  @Output() private readonly actionTriggerSelect: EventEmitter<ActionTriggerWithActionInfo<KeyboardAndSelectionTriggerData> | undefined> = new EventEmitter<
    ActionTriggerWithActionInfo<KeyboardAndSelectionTriggerData> | undefined
  >()
  public search: string = ''
  public sortLabel: string = $localize`global.sort.label`
  public readonly iconButton = IconButton
  public readonly iconButtonSize = IconButtonSize
  public sort: ActionTriggerSortKeys = ActionTriggerSortKeys.ACTION_ID_A_Z
  public readonly sortActionsTriggers: SofieDroppdownOptions[] = [
    { key: ActionTriggerSortKeys.ACTION_ID_A_Z, label: $localize`action-triggers-sort.action-label-a-z.label` },
    { key: ActionTriggerSortKeys.ACTION_ID_Z_A, label: $localize`action-triggers-sort.action-label-z-a.label` },
    { key: ActionTriggerSortKeys.SHORTCUT_A_Z, label: $localize`action-triggers-sort.shortcut-a-z.label` },
    { key: ActionTriggerSortKeys.SHORTCUT_Z_A, label: $localize`action-triggers-sort.shortcut-z-a.label` },
  ]

  public readonly selectedTriggersOptions: SofieDroppdownOptions[] = [
    { key: UserActionsWithSelectedTriggers.DISABLE_SELECTION, label: $localize`action-triggers.disable-multi-selection.label`, disabled: false },
    { key: UserActionsWithSelectedTriggers.TOGGLE_SELECT, label: $localize`global.select-all.label`, disabled: false },
    { key: UserActionsWithSelectedTriggers.EXPORT, label: $localize`global.export-selected.label`, disabled: true },
    { key: UserActionsWithSelectedTriggers.DELETE, label: $localize`global.delete-selected.label`, disabled: true },
  ]

  public selectedCount: number = 0
  public selectMode: boolean = false

  constructor(
    private readonly dialogService: DialogService,
    private readonly fileDownloadService: HttpFileDownloadService,
    private readonly actionTriggerService: ActionTriggerService
  ) {}

  public ngOnInit(): void {
    this.newSortSelect(this.sort)
  }

  get filteredActionsTriggers(): ActionTriggerWithActionInfo<KeyboardAndSelectionTriggerData>[] {
    return this.actionTriggers.filter(
      trigger =>
        trigger.data.label.toLocaleLowerCase().includes(this.search.toLocaleLowerCase()) ||
        trigger.data.keys.toString().toLocaleLowerCase().includes(this.search.toLocaleLowerCase()) ||
        trigger.id === this.selectedActionTrigger?.id
    )
  }

  public selectActionTrigger(actionTrigger: ActionTriggerWithActionInfo<KeyboardAndSelectionTriggerData> | undefined): void {
    if (this.selectedActionTrigger?.id === actionTrigger?.id) {
      this.actionTriggerSelect.emit(undefined)
    } else {
      this.actionTriggerSelect.emit(actionTrigger)
    }
  }

  public actionTriggerCheckToggle(isSelected: boolean, index: number): void {
    this.actionTriggers[index].data.selected = isSelected
    this.checkSelectedCount()
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
      data: {
        keys: actionTrigger.data.keys,
        label: actionTrigger.data.label,
        actionArguments: actionTrigger.data.actionArguments,
        triggerOn: actionTrigger.data.triggerOn,
      },
    }
    if (actionTrigger.data.mappedToKeys && actionTrigger.data.mappedToKeys.length > 0) {
      copyPayload.data.mappedToKeys = actionTrigger.data.mappedToKeys
    }
    this.actionTriggerService.createActionTrigger(copyPayload).subscribe()
  }

  public selectNewSort(sortOption: string): void {
    this.newSortSelect(sortOption as ActionTriggerSortKeys)
  }

  private newSortSelect(sort: ActionTriggerSortKeys): void {
    this.sort = sort
    switch (sort) {
      case ActionTriggerSortKeys.ACTION_ID_A_Z:
        this.actionTriggers = this.actionTriggers.sort((a, b) => a.data.label.localeCompare(b.data.label))
        break
      case ActionTriggerSortKeys.ACTION_ID_Z_A:
        this.actionTriggers = this.actionTriggers.sort((a, b) => b.data.label.localeCompare(a.data.label))
        break
      case ActionTriggerSortKeys.SHORTCUT_A_Z:
        this.actionTriggers = this.actionTriggers.sort((a, b) => a.data?.keys.toString().localeCompare(b.data?.keys.toString()))
        break
      case ActionTriggerSortKeys.SHORTCUT_Z_A:
        this.actionTriggers = this.actionTriggers.sort((a, b) => b.data?.keys.toString().localeCompare(a.data?.keys.toString()))
        break
      default:
        this.actionTriggers = this.actionTriggers.sort((a, b) => a.actionId.localeCompare(b.actionId))
        break
    }
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
    return this.actionTriggers.filter(item => item.data.selected)
  }

  private checkSelectedCount(): void {
    this.selectedCount = this.actionTriggers.filter(item => item.data.selected).length
    const toggleSelectIndex = this.selectedTriggersOptions.findIndex(item => item.key === UserActionsWithSelectedTriggers.TOGGLE_SELECT)
    this.selectedTriggersOptions.forEach(option => {
      if (option.key === UserActionsWithSelectedTriggers.TOGGLE_SELECT) {
        if (this.selectedCount === this.actionTriggers.length) {
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
    const triggersCopy: ActionTrigger<KeyboardAndSelectionTriggerData>[] = this.selectedActionTriggers.map(item => {
      return {
        actionId: item.actionId,
        id: item.id,
        data: {
          keys: item.data.keys,
          actionArguments: item.data.actionArguments,
          label: item.data.label,
          triggerOn: item.data.triggerOn,
          mappedToKeys: item.data.mappedToKeys,
        },
      }
    })
    this.fileDownloadService.downloadText(JSON.stringify(triggersCopy), 'selected-actions-triggers.json')
    this.unselectAllActionsTriggers()
    this.checkSelectedCount()
  }

  private toggleSelectUnselectAll(): void {
    if (this.selectedCount === this.actionTriggers.length) {
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
    this.actionTriggers.forEach(trigger => (trigger.data.selected = true))
  }
}
