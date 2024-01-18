import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange, SimpleChanges } from '@angular/core'
import { IconButton, IconButtonSize } from 'src/app/shared/enums/icon-button'
import { ActionTrigger, ActionTriggerWithActionInfo } from 'src/app/shared/models/action-trigger'
import { SofieDropdownOption } from 'src/app/shared/components/dropdown-button/dropdown-button.component'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { ActionTriggerService } from 'src/app/shared/abstractions/action-trigger.service'
import { ActionTriggerSortKeys, KeyboardTriggerData } from 'src/app/shared/models/keyboard-trigger'
import { SortOrder } from 'src/app/shared/models/forms'
import { FileDownloadService } from 'src/app/core/abstractions/file-download.service'
import { UserActionsWithSelected } from 'src/app/shared/models/settings'

@Component({
  selector: 'sofie-action-triggers-list',
  templateUrl: './action-triggers-list.component.html',
  styleUrls: ['./action-triggers-list.component.scss'],
})
export class ActionTriggersListComponent implements OnChanges {
  @Input() public actionTriggers: ActionTriggerWithActionInfo<KeyboardTriggerData>[]
  @Input() public selectedActionTrigger?: ActionTriggerWithActionInfo<KeyboardTriggerData>
  @Output() private readonly onActionTriggerOpen: EventEmitter<ActionTriggerWithActionInfo<KeyboardTriggerData>> = new EventEmitter<ActionTriggerWithActionInfo<KeyboardTriggerData>>()
  public search: string = ''
  public sort: string = `${ActionTriggerSortKeys.ACTION}_${SortOrder.ALPHABETICAL}`
  public readonly sortLabel: string = $localize`global.sort.label`
  public readonly iconButton = IconButton
  public readonly iconButtonSize = IconButtonSize
  public readonly sortActionsTriggers: SofieDropdownOption[] = [
    { key: `${ActionTriggerSortKeys.ACTION}_${SortOrder.ALPHABETICAL}`, label: $localize`action-triggers-sort.action-label-alphabetical.label` },
    { key: `${ActionTriggerSortKeys.ACTION}_${SortOrder.REVERSE_ALPHABETICAL}`, label: $localize`action-triggers-sort.action-label-reverse-alphabetical.label` },
    { key: `${ActionTriggerSortKeys.SHORTCUT}_${SortOrder.ALPHABETICAL}`, label: $localize`action-triggers-sort.shortcut-alphabetical.label` },
    { key: `${ActionTriggerSortKeys.SHORTCUT}_${SortOrder.REVERSE_ALPHABETICAL}`, label: $localize`action-triggers-sort.shortcut-reverse-alphabetical.label` },
  ]

  public selectedActionTriggerOptions: SofieDropdownOption[] = [
    { key: UserActionsWithSelected.DISABLE_SELECTION, label: $localize`action-triggers.disable-multiselect.label`, isDisabled: false },
    { key: UserActionsWithSelected.TOGGLE_SELECT, label: $localize`global.select-all.label`, isDisabled: false },
    { key: UserActionsWithSelected.EXPORT, label: $localize`global.export-selected.label`, isDisabled: true },
    { key: UserActionsWithSelected.DELETE, label: $localize`global.delete-selected.label`, isDisabled: true },
  ]
  public selectMode: boolean = false
  private readonly selectedActionTriggerIds: Set<string> = new Set()

  constructor(
    private readonly dialogService: DialogService,
    private readonly fileDownloadService: FileDownloadService,
    private readonly actionTriggerService: ActionTriggerService
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    const actionTriggerChange: SimpleChange | undefined = changes['actionTriggers']
    if (actionTriggerChange) {
      this.newSortSelect(this.sort)
    }
  }

  get filteredActionsTriggers(): ActionTriggerWithActionInfo<KeyboardTriggerData>[] {
    return this.actionTriggers.filter(
      trigger =>
        trigger.data.label.toLocaleLowerCase().includes(this.search.toLocaleLowerCase()) ||
        trigger.data.keys.toString().toLocaleLowerCase().includes(this.search.toLocaleLowerCase()) ||
        trigger.id === this.selectedActionTrigger?.id
    )
  }

  public selectActionTrigger(actionTrigger?: ActionTriggerWithActionInfo<KeyboardTriggerData>): void {
    this.onActionTriggerOpen.emit(this.selectedActionTrigger?.id === actionTrigger?.id ? undefined : actionTrigger)
  }

  public setActionTriggerSelection(actionTriggerId: string, isSelected: boolean): void {
    if (isSelected) {
      this.selectedActionTriggerIds.add(actionTriggerId)
    } else {
      this.selectedActionTriggerIds.delete(actionTriggerId)
    }
    this.updateSelectedActionTriggersOptions()
  }

  public actionTriggerDelete(actionTriggerId: string): void {
    this.dialogService.createConfirmDialog($localize`global.delete.label`, $localize`action-triggers.delete.confirmation`, 'Delete', () => this.deleteActionTriggerById(actionTriggerId))
  }

  private deleteActionTriggerById(actionTriggerId: string): void {
    this.closeSelectedTabIfAreDeleted(actionTriggerId)
    this.actionTriggerService.deleteActionTrigger(actionTriggerId).subscribe()
  }

  private closeSelectedTabIfAreDeleted(deletedActionId: string): void {
    if (this.selectedActionTrigger?.id === deletedActionId) {
      this.onActionTriggerOpen.emit(undefined)
    }
  }

  private deleteSelectedActionTriggers(): void {
    this.selectedActionTriggerIds.forEach(actionTriggerId => this.deleteActionTriggerById(actionTriggerId))
  }

  public actionTriggerCopy(actionTrigger: ActionTriggerWithActionInfo<KeyboardTriggerData>): void {
    const copyPayload: ActionTrigger<KeyboardTriggerData> = {
      actionId: actionTrigger.actionId,
      id: '',
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

  private newSortSelect(sort: string): void {
    this.sort = sort
    switch (sort) {
      case `${ActionTriggerSortKeys.ACTION}_${SortOrder.ALPHABETICAL}`:
        this.actionTriggers = this.actionTriggers.sort((a, b) => a.data.label.localeCompare(b.data.label))
        break
      case `${ActionTriggerSortKeys.ACTION}_${SortOrder.REVERSE_ALPHABETICAL}`:
        this.actionTriggers = this.actionTriggers.sort((a, b) => b.data.label.localeCompare(a.data.label))
        break
      case `${ActionTriggerSortKeys.SHORTCUT}_${SortOrder.ALPHABETICAL}`:
        this.actionTriggers = this.actionTriggers.sort((a, b) => a.data?.keys.toString().localeCompare(b.data?.keys.toString()))
        break
      case `${ActionTriggerSortKeys.SHORTCUT}_${SortOrder.REVERSE_ALPHABETICAL}`:
        this.actionTriggers = this.actionTriggers.sort((a, b) => b.data?.keys.toString().localeCompare(a.data?.keys.toString()))
        break
      default:
        this.actionTriggers = this.actionTriggers.sort((a, b) => a.actionId.localeCompare(b.actionId))
        break
    }
  }

  public actionWithSelected(userAction: string): void {
    switch (userAction) {
      case UserActionsWithSelected.DELETE:
        return this.dialogService.createConfirmDialog($localize`action-triggers.delete-selected.label`, $localize`action-triggers.delete-selected.confirmation`, 'Delete', () =>
          this.deleteSelectedActionTriggers()
        )
      case UserActionsWithSelected.EXPORT:
        return this.exportSelectedTriggers()
      case UserActionsWithSelected.TOGGLE_SELECT:
        return this.toggleSelectUnselectAll()
      case UserActionsWithSelected.DISABLE_SELECTION:
        this.selectMode = false
        this.unselectAllActionsTriggers()
        this.updateSelectedActionTriggersOptions()
        break
      default:
        return
    }
  }

  private updateSelectedActionTriggersOptions(): void {
    this.selectedActionTriggerOptions = this.selectedActionTriggerOptions.map(this.updateSelectedActionTriggersOption.bind(this))
  }

  private updateSelectedActionTriggersOption(option: SofieDropdownOption): SofieDropdownOption {
    switch (option.key) {
      case UserActionsWithSelected.TOGGLE_SELECT:
        return {
          ...option,
          label: this.areAllActionTriggersSelected() ? $localize`global.unselect-all.label` : $localize`global.select-all.label`,
        }
      case UserActionsWithSelected.EXPORT:
      case UserActionsWithSelected.DELETE:
        return {
          ...option,
          isDisabled: this.isNoActionTriggerSelected(),
        }
      default:
        return option
    }
  }

  private areAllActionTriggersSelected(): boolean {
    return this.actionTriggers.length === this.selectedActionTriggerIds.size
  }

  private isNoActionTriggerSelected(): boolean {
    return this.selectedActionTriggerIds.size === 0
  }

  public isActionTriggerSelected(id: string): boolean {
    return this.selectedActionTriggerIds.has(id)
  }

  private exportSelectedTriggers(): void {
    const selectedTriggers: ActionTrigger<KeyboardTriggerData>[] = []
    this.selectedActionTriggerIds.forEach(actionTriggerId => {
      const actionTrigger: ActionTrigger<KeyboardTriggerData> | undefined = this.actionTriggers.find(actionTriggerItem => actionTriggerItem.id === actionTriggerId)
      if (!actionTrigger) {
        return
      }
      selectedTriggers.push({
        actionId: actionTrigger.actionId,
        id: actionTrigger.id,
        data: {
          keys: actionTrigger.data.keys,
          actionArguments: actionTrigger.data.actionArguments,
          label: actionTrigger.data.label,
          triggerOn: actionTrigger.data.triggerOn,
          mappedToKeys: actionTrigger.data.mappedToKeys,
        },
      })
    })

    this.fileDownloadService.downloadText(JSON.stringify(selectedTriggers), 'selected-actions-triggers.json')
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

  private selectAllActionsTriggers(): void {
    this.actionTriggers.forEach(trigger => this.setActionTriggerSelection(trigger.id, true))
  }
}
