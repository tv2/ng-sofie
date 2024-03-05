import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange, SimpleChanges } from '@angular/core'
import { IconButton, IconButtonSize } from 'src/app/shared/enums/icon-button'
import { ActionTrigger, ActionTriggerWithAction } from 'src/app/shared/models/action-trigger'
import { SofieDropdownOption } from 'src/app/shared/components/dropdown-button/dropdown-button.component'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { ActionTriggerService } from 'src/app/shared/abstractions/action-trigger.service'
import { ActionTriggerSortKeys, KeyboardTriggerData } from 'src/app/shared/models/keyboard-trigger'
import { SortOrder } from 'src/app/shared/models/forms'
import { FileDownloadService } from 'src/app/core/abstractions/file-download.service'
import { ActionsWithSelected } from 'src/app/shared/models/settings'
import { Keys } from 'src/app/keyboard/value-objects/key-binding'

@Component({
  selector: 'sofie-action-triggers-list',
  templateUrl: './action-triggers-list.component.html',
  styleUrls: ['./action-triggers-list.component.scss'],
})
export class ActionTriggersListComponent implements OnChanges {
  @Input() public actionTriggersWithAction: ActionTriggerWithAction<KeyboardTriggerData>[]
  @Input() public selectedActionTrigger?: ActionTriggerWithAction<KeyboardTriggerData>
  @Output() private readonly onActionTriggerOpen: EventEmitter<ActionTriggerWithAction<KeyboardTriggerData>> = new EventEmitter<ActionTriggerWithAction<KeyboardTriggerData>>()
  public search: string = ''
  public sortQuery: string = `${ActionTriggerSortKeys.ACTION}_${SortOrder.ALPHABETICAL}`
  public readonly sortLabel: string = $localize`global.sort.label`
  public readonly IconButton = IconButton
  public readonly IconButtonSize = IconButtonSize
  public readonly sortActionsTriggers: SofieDropdownOption[] = [
    { key: `${ActionTriggerSortKeys.ACTION}_${SortOrder.ALPHABETICAL}`, label: $localize`action-triggers-sort.action-label-alphabetical.label` },
    { key: `${ActionTriggerSortKeys.ACTION}_${SortOrder.REVERSE_ALPHABETICAL}`, label: $localize`action-triggers-sort.action-label-reverse-alphabetical.label` },
    { key: `${ActionTriggerSortKeys.SHORTCUT}_${SortOrder.ALPHABETICAL}`, label: $localize`action-triggers-sort.shortcut-alphabetical.label` },
    { key: `${ActionTriggerSortKeys.SHORTCUT}_${SortOrder.REVERSE_ALPHABETICAL}`, label: $localize`action-triggers-sort.shortcut-reverse-alphabetical.label` },
  ]

  public selectedActionTriggerOptions: SofieDropdownOption[] = [
    { key: ActionsWithSelected.TOGGLE_SELECT, label: $localize`global.select-all.label`, isDisabled: false },
    { key: ActionsWithSelected.EXPORT, label: $localize`global.export-selected.label`, isDisabled: true },
    { key: ActionsWithSelected.DELETE, label: $localize`global.delete-selected.label`, isDisabled: true },
  ]
  public selectMode: boolean = false
  private readonly selectedActionTriggerIds: Set<string> = new Set()

  constructor(
    private readonly dialogService: DialogService,
    private readonly fileDownloadService: FileDownloadService,
    private readonly actionTriggerService: ActionTriggerService
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    const actionTriggerChange: SimpleChange | undefined = changes['actionTriggersWithAction']
    if (actionTriggerChange) {
      this.applySortQuery(this.sortQuery)
    }
  }

  get filteredActionsTriggers(): ActionTriggerWithAction<KeyboardTriggerData>[] {
    const lowercasedSearchQuery: string = this.search.toLocaleLowerCase()
    return this.actionTriggersWithAction.filter(
      actionTriggerWithAction =>
        actionTriggerWithAction.actionTrigger.data.label.toLocaleLowerCase().includes(lowercasedSearchQuery) ||
        this.getMappedToOrShortcutKeys(actionTriggerWithAction.actionTrigger).toString().toLocaleLowerCase().includes(lowercasedSearchQuery) ||
        actionTriggerWithAction.action.name.toString().toLocaleLowerCase().includes(lowercasedSearchQuery) ||
        actionTriggerWithAction.actionTrigger.id === this.selectedActionTrigger?.actionTrigger.id
    )
  }

  private getMappedToOrShortcutKeys(actionTrigger: ActionTrigger<KeyboardTriggerData>): Keys {
    return actionTrigger.data.mappedToKeys && actionTrigger.data.mappedToKeys.length > 0 ? actionTrigger.data.mappedToKeys : actionTrigger.data.keys
  }

  public selectActionTrigger(actionTriggerWithAction?: ActionTriggerWithAction<KeyboardTriggerData>): void {
    if (this.selectMode) {
      return
    }
    this.onActionTriggerOpen.emit(this.selectedActionTrigger?.actionTrigger.id === actionTriggerWithAction?.actionTrigger.id ? undefined : actionTriggerWithAction)
  }

  public setSelectMode(isSelected: boolean): void {
    if (isSelected) {
      this.selectActionTrigger()
    } else {
      this.unselectAllActionsTriggers()
      this.updateSelectedActionTriggersOptions()
    }
    this.selectMode = isSelected
  }

  public setActionTriggerSelection(actionTriggerId: string, isSelected: boolean): void {
    if (isSelected) {
      this.selectedActionTriggerIds.add(actionTriggerId)
    } else {
      this.selectedActionTriggerIds.delete(actionTriggerId)
    }
    this.updateSelectedActionTriggersOptions()
  }

  public openDeleteActionTriggerDialog(actionTriggerId: string): void {
    this.dialogService.createConfirmDialog($localize`global.delete.label`, $localize`action-triggers.delete.confirmation`, 'Delete', () => this.deleteActionTriggerById(actionTriggerId))
  }

  private deleteActionTriggerById(actionTriggerId: string): void {
    this.closeSelectedTabIfAreDeleted(actionTriggerId)
    this.actionTriggerService.deleteActionTrigger(actionTriggerId).subscribe()
  }

  private closeSelectedTabIfAreDeleted(deletedActionId: string): void {
    if (this.selectedActionTrigger?.actionTrigger.id === deletedActionId) {
      this.onActionTriggerOpen.emit(undefined)
    }
  }

  private deleteSelectedActionTriggers(): void {
    this.selectedActionTriggerIds.forEach(actionTriggerId => this.deleteActionTriggerById(actionTriggerId))
    this.unselectAllActionsTriggers()
  }

  public cloneActionTrigger(actionTriggerWithAction: ActionTriggerWithAction<KeyboardTriggerData>): void {
    const clonedActionTrigger: ActionTrigger<KeyboardTriggerData> = {
      ...actionTriggerWithAction.actionTrigger,
      id: '',
    }
    this.actionTriggerService.createActionTrigger(clonedActionTrigger).subscribe()
  }

  public applySortQuery(sort: string): void {
    this.sortQuery = sort
    switch (sort) {
      case `${ActionTriggerSortKeys.ACTION}_${SortOrder.ALPHABETICAL}`:
        this.actionTriggersWithAction = this.actionTriggersWithAction.sort((a, b) => a.actionTrigger.data.label.localeCompare(b.actionTrigger.data.label))
        break
      case `${ActionTriggerSortKeys.ACTION}_${SortOrder.REVERSE_ALPHABETICAL}`:
        this.actionTriggersWithAction = this.actionTriggersWithAction.sort((a, b) => b.actionTrigger.data.label.localeCompare(a.actionTrigger.data.label))
        break
      case `${ActionTriggerSortKeys.SHORTCUT}_${SortOrder.ALPHABETICAL}`:
        this.actionTriggersWithAction = this.actionTriggersWithAction.sort((a, b) => a.actionTrigger.data?.keys.toString().localeCompare(b.actionTrigger.data?.keys.toString()))
        break
      case `${ActionTriggerSortKeys.SHORTCUT}_${SortOrder.REVERSE_ALPHABETICAL}`:
        this.actionTriggersWithAction = this.actionTriggersWithAction.sort((a, b) => b.actionTrigger.data?.keys.toString().localeCompare(a.actionTrigger.data?.keys.toString()))
        break
      default:
        this.actionTriggersWithAction = this.actionTriggersWithAction.sort((a, b) => a.actionTrigger.actionId.localeCompare(b.actionTrigger.actionId))
        break
    }
  }

  public applyUserActionToSelectedActionTriggers(userAction: string): void {
    switch (userAction) {
      case ActionsWithSelected.DELETE:
        return this.dialogService.createConfirmDialog($localize`action-triggers.delete-selected.label`, $localize`action-triggers.delete-selected.confirmation`, 'Delete', () =>
          this.deleteSelectedActionTriggers()
        )
      case ActionsWithSelected.EXPORT:
        return this.exportSelectedActionTriggers()
      case ActionsWithSelected.TOGGLE_SELECT:
        return this.toggleSelectUnselectAll()
      default:
        return
    }
  }

  private updateSelectedActionTriggersOptions(): void {
    this.selectedActionTriggerOptions = this.selectedActionTriggerOptions.map(this.updateSelectedActionTriggersOption.bind(this))
  }

  private updateSelectedActionTriggersOption(option: SofieDropdownOption): SofieDropdownOption {
    switch (option.key) {
      case ActionsWithSelected.TOGGLE_SELECT:
        return {
          ...option,
          label: this.areAllActionTriggersSelected() ? $localize`global.unselect-all.label` : $localize`global.select-all.label`,
        }
      case ActionsWithSelected.EXPORT:
      case ActionsWithSelected.DELETE:
        return {
          ...option,
          isDisabled: this.isNoActionTriggerSelected(),
        }
      default:
        return option
    }
  }

  private areAllActionTriggersSelected(): boolean {
    return this.actionTriggersWithAction.length === this.selectedActionTriggerIds.size
  }

  private isNoActionTriggerSelected(): boolean {
    return this.selectedActionTriggerIds.size === 0
  }

  public isActionTriggerSelected(id: string): boolean {
    return this.selectedActionTriggerIds.has(id)
  }

  private exportSelectedActionTriggers(): void {
    this.fileDownloadService.downloadText(JSON.stringify(this.getSelectedActionTriggers()), 'selected-actions-triggers.json')
    this.unselectAllActionsTriggers()
    this.updateSelectedActionTriggersOptions()
  }

  private toggleSelectUnselectAll(): void {
    if (this.areAllActionTriggersSelected()) {
      this.unselectAllActionsTriggers()
    } else {
      this.selectAllActionsTriggers()
    }
    this.updateSelectedActionTriggersOptions()
  }

  private unselectAllActionsTriggers(): void {
    this.selectedActionTriggerIds.clear()
  }

  private getSelectedActionTriggers(): ActionTrigger<KeyboardTriggerData>[] {
    return this.actionTriggersWithAction
      .filter(actionTriggerWithAction => this.selectedActionTriggerIds.has(actionTriggerWithAction.actionTrigger.id))
      .map(actionTriggerWithAction => actionTriggerWithAction.actionTrigger)
  }

  private selectAllActionsTriggers(): void {
    this.actionTriggersWithAction.forEach(trigger => this.setActionTriggerSelection(trigger.actionTrigger.id, true))
  }
}
