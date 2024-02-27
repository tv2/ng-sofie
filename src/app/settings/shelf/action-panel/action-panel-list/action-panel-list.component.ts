import { Component, Input, OnChanges, SimpleChanges } from '@angular/core'
import { ShelfActionPanelConfiguration, ShelfActionPanelConfigurationWithId, ShelfConfiguration } from 'src/app/shared/models/shelf-configuration'
import { SofieTableHeader, SofieTableHeaderSize, SortDirection } from '../../../../shared/components/sofie-table-header/sofie-table-header.component'
import { IconButton, IconButtonSize } from 'src/app/shared/enums/icon-button'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { ConfigurationService } from 'src/app/shared/services/configuration.service'
import { FileDownloadService } from 'src/app/core/abstractions/file-download.service'

export enum ShelfActionPanelHeaderKeys {
  NAME = 'name',
  RANK = 'rank',
  FILTERS = 'filters',
}

@Component({
  selector: 'sofie-action-panel-list',
  templateUrl: './action-panel-list.component.html',
  styleUrls: ['./action-panel-list.component.scss'],
})
export class ActionPanelListComponent implements OnChanges {
  @Input() public shelfConfiguration: ShelfConfiguration<ShelfActionPanelConfigurationWithId>

  public readonly createNewLabel: string = $localize`global.create-new.label`
  public readonly shelfActionPanelTableHeaders: SofieTableHeader[] = [
    { isSortable: true, key: ShelfActionPanelHeaderKeys.NAME, size: SofieTableHeaderSize.md, label: 'Panel name' },
    { isSortable: true, key: ShelfActionPanelHeaderKeys.RANK, size: SofieTableHeaderSize.md, label: 'Rank' },
    { isSortable: true, key: ShelfActionPanelHeaderKeys.FILTERS, label: 'Filters' },
  ]
  public readonly selectedActionPanelIds: Set<string> = new Set()

  public sortColumn: ShelfActionPanelHeaderKeys = ShelfActionPanelHeaderKeys.RANK
  public sortDirection: SortDirection = SortDirection.ASC
  public search: string = ''

  constructor(
    private readonly dialogService: DialogService,
    private readonly fileDownloadService: FileDownloadService,
    private readonly configurationService: ConfigurationService
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if ('shelfConfiguration' in changes) {
      this.resortTable()
      this.selectedActionPanelIds.clear()
    }
  }

  private resortTable(): void {
    switch (this.sortColumn) {
      case ShelfActionPanelHeaderKeys.NAME:
        if (this.sortDirection === SortDirection.ASC) {
          this.saveNewPanelConfigurations(this.shelfConfiguration.actionPanelConfigurations.sort((a, b) => a.name.localeCompare(b.name)))
        } else {
          this.saveNewPanelConfigurations(this.shelfConfiguration.actionPanelConfigurations.sort((a, b) => b.name.localeCompare(a.name)))
        }
        break
      case ShelfActionPanelHeaderKeys.RANK:
        if (this.sortDirection === SortDirection.ASC) {
          this.saveNewPanelConfigurations(this.shelfConfiguration.actionPanelConfigurations.sort((a, b) => a.rank - b.rank))
        } else {
          this.saveNewPanelConfigurations(this.shelfConfiguration.actionPanelConfigurations.sort((a, b) => b.rank - a.rank))
        }
        break
      case ShelfActionPanelHeaderKeys.FILTERS:
        if (this.sortDirection === SortDirection.ASC) {
          this.saveNewPanelConfigurations(this.shelfConfiguration.actionPanelConfigurations.sort((a, b) => a.actionFilter.toString().localeCompare(b.actionFilter.toString())))
        } else {
          this.saveNewPanelConfigurations(this.shelfConfiguration.actionPanelConfigurations.sort((a, b) => b.actionFilter.toString().localeCompare(a.actionFilter.toString())))
        }
        break
      default:
        break
    }
  }

  private saveNewPanelConfigurations(newPanelConfigurations: ShelfActionPanelConfigurationWithId[]): void {
    this.shelfConfiguration = { id: this.shelfConfiguration.id, actionPanelConfigurations: [...newPanelConfigurations] }
  }

  public saveSortValues(sortColumn: SofieTableHeader): void {
    if (this.sortColumn === sortColumn.key) {
      this.sortDirection = this.sortDirection === SortDirection.DESC ? SortDirection.ASC : SortDirection.DESC
    } else {
      this.sortColumn = sortColumn.key as ShelfActionPanelHeaderKeys
      this.sortDirection = SortDirection.ASC
    }
    this.resortTable()
  }

  public isActionPanelSelected(id: string): boolean {
    return this.selectedActionPanelIds.has(id)
  }

  public setActionPanelSelection(id: string, isSelected: boolean): void {
    if (isSelected) {
      this.selectedActionPanelIds.add(id)
    } else {
      this.selectedActionPanelIds.delete(id)
    }
  }

  public toggleAllActionPanelSelection(isSelected: boolean): void {
    if (isSelected) {
      this.shelfConfiguration.actionPanelConfigurations.forEach(panelConfiguration => this.setActionPanelSelection(panelConfiguration.id, true))
    } else {
      this.selectedActionPanelIds.clear()
    }
  }

  public isAllActionPanelSelected(): boolean {
    return this.selectedActionPanelIds.size === this.shelfConfiguration.actionPanelConfigurations.length
  }

  public exportActionPanels(): void {
    const shelfConfiguration: ShelfConfiguration<ShelfActionPanelConfiguration> = this.shelfConfigurationWithoutIds
    this.fileDownloadService.downloadText(JSON.stringify(shelfConfiguration), 'shelf-configuration.json')
  }

  public exportSelectedActionPanels(): void {
    const filteredShelfConfiguration = this.shelfConfiguration.actionPanelConfigurations.filter(panelConfiguration => this.selectedActionPanelIds.has(panelConfiguration.id))
    this.fileDownloadService.downloadText(
      JSON.stringify({
        id: this.shelfConfiguration.id,
        actionPanelConfigurations: this.removeIdFromConfigurations(filteredShelfConfiguration),
      }),
      'selected-shelf-configuration.json'
    )
    this.selectedActionPanelIds.clear()
  }

  private removeIdFromConfigurations(actionPanelConfigurations: ShelfActionPanelConfigurationWithId[]): ShelfActionPanelConfiguration[] {
    return [
      ...actionPanelConfigurations.map(panelConfiguration => {
        return {
          actionFilter: panelConfiguration.actionFilter,
          name: panelConfiguration.name,
          rank: panelConfiguration.rank,
        }
      }),
    ]
  }

  public openDeleteSelectedActionPanelDialog(): void {
    this.dialogService.createConfirmDialog($localize`global.delete-selected.label`, $localize`action-panel.delete-selected.confirmation`, $localize`global.delete.label`, () =>
      this.deleteSelectedActionPanel()
    )
  }

  private deleteSelectedActionPanel(): void {
    const selectedPanelConfigurations = this.shelfConfiguration.actionPanelConfigurations.filter(panelConfiguration => !this.selectedActionPanelIds.has(panelConfiguration.id))
    this.configurationService.updateShelfConfiguration({ id: this.shelfConfiguration.id, actionPanelConfigurations: this.removeIdFromConfigurations(selectedPanelConfigurations) }).subscribe()
  }

  private get shelfConfigurationWithoutIds(): ShelfConfiguration<ShelfActionPanelConfiguration> {
    return {
      id: this.shelfConfiguration.id,
      actionPanelConfigurations: this.shelfConfiguration.actionPanelConfigurations.map(panelConfiguration => {
        return {
          actionFilter: panelConfiguration.actionFilter,
          name: panelConfiguration.name,
          rank: panelConfiguration.rank,
        }
      }),
    }
  }

  public openDeleteActionPanelDialog(actionPanelIndex: number): void {
    this.dialogService.createConfirmDialog($localize`global.delete.label`, $localize`action-panel.delete.confirmation`, $localize`global.delete.label`, () =>
      this.deleteActionPanelByIndex(actionPanelIndex)
    )
  }

  public deleteActionPanelByIndex(actionPanelIndex: number): void {
    const copyOfShelfConfiguration: ShelfConfiguration<ShelfActionPanelConfigurationWithId> = JSON.parse(JSON.stringify(this.shelfConfigurationWithoutIds))
    copyOfShelfConfiguration.actionPanelConfigurations.splice(actionPanelIndex, 1)
    this.configurationService.updateShelfConfiguration(copyOfShelfConfiguration).subscribe()
  }

  public cloneActionPanel(actionPanelIndex: number): void {
    const copyOfShelfConfiguration: ShelfConfiguration<ShelfActionPanelConfiguration> = JSON.parse(JSON.stringify(this.shelfConfigurationWithoutIds))
    copyOfShelfConfiguration.actionPanelConfigurations.splice(actionPanelIndex, 0, copyOfShelfConfiguration.actionPanelConfigurations[actionPanelIndex])
    this.configurationService.updateShelfConfiguration(copyOfShelfConfiguration).subscribe()
  }

  public get filteredActionsPannels(): ShelfActionPanelConfigurationWithId[] {
    const lowercasedSearchQuery: string = this.search.toLocaleLowerCase()
    return this.shelfConfiguration.actionPanelConfigurations.filter(
      actionPannel => actionPannel.name.toLocaleLowerCase().includes(lowercasedSearchQuery) || actionPannel.rank.toString().toLocaleLowerCase().includes(lowercasedSearchQuery)
    )
  }

  protected readonly IconButton = IconButton
  protected readonly IconButtonSize = IconButtonSize
}
