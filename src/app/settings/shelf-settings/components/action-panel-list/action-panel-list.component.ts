import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { ShelfActionPanelConfiguration, ShelfConfiguration } from 'src/app/shared/models/shelf-configuration'
import { SofieTableHeaderToBeDeleted, SofieTableHeaderSize, SortDirection } from '../../../../shared/components/sofie-table-header/sofie-table-header.component'
import { IconButton, IconButtonSize } from 'src/app/shared/enums/icon-button'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { ConfigurationService } from 'src/app/shared/services/configuration.service'
import { FileDownloadService } from 'src/app/shared/abstractions/file-download.service'
import { Tv2ActionContentType } from 'src/app/shared/models/tv2-action'
import { TranslationActionTypePipe } from 'src/app/shared/pipes/translation-known-values.pipe'
import { MultiSelectOptions } from '../../../../shared/components/multi-select-old/multi-select-component-old.component'

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
export class ActionPanelListComponent implements OnChanges, OnInit {
  @Input() public shelfConfiguration: ShelfConfiguration

  public readonly createNewLabel: string = $localize`global.create-new.label`
  public readonly selectedFiltersLabel: string = $localize`global.selected-filters.label`
  public readonly filtersLabel: string = $localize`global.filters.label`
  public readonly exportLabel: string = $localize`global.export.label`
  public readonly exportSelectedLabel: string = $localize`global.export-selected.label`
  public readonly deleteSelectedLabel: string = $localize`global.delete-selected.label`
  public readonly shelfActionPanelTableHeaders: SofieTableHeaderToBeDeleted[] = [
    { isSortable: true, key: ShelfActionPanelHeaderKeys.NAME, size: SofieTableHeaderSize.md, label: 'Panel name' },
    { isSortable: true, key: ShelfActionPanelHeaderKeys.RANK, size: SofieTableHeaderSize.md, label: 'Rank' },
    { isSortable: true, key: ShelfActionPanelHeaderKeys.FILTERS, label: 'Filters' },
  ]
  public readonly selectedActionPanelIds: Set<string> = new Set()

  public sortColumn: ShelfActionPanelHeaderKeys = ShelfActionPanelHeaderKeys.RANK
  public sortDirection: SortDirection = SortDirection.ASC
  public search: string = ''
  public actionPanelFilters: Tv2ActionContentType[] = []
  public filterActionPanelOptions: MultiSelectOptions[]

  constructor(
    private readonly dialogService: DialogService,
    private readonly fileDownloadService: FileDownloadService,
    private readonly translationActionTypePipe: TranslationActionTypePipe,
    private readonly configurationService: ConfigurationService
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if ('shelfConfiguration' in changes) {
      this.resortTable()
      this.selectedActionPanelIds.clear()
    }
  }

  public ngOnInit(): void {
    const tv2ActionContentTypeArray: string[] = Object.keys(Tv2ActionContentType)
    this.filterActionPanelOptions = tv2ActionContentTypeArray.map(key => {
      return { id: key, label: this.translationActionTypePipe.transform(key), classesOnSelected: `${key.toLocaleLowerCase()}_color` }
    })
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

  private saveNewPanelConfigurations(newPanelConfigurations: ShelfActionPanelConfiguration[]): void {
    this.shelfConfiguration = { id: this.shelfConfiguration.id, actionPanelConfigurations: [...newPanelConfigurations] }
  }

  public saveSortValues(sortColumn: SofieTableHeaderToBeDeleted): void {
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

  public openCreateNewActionPanel(): void {
    // TODO: Implement
    alert('Open create new ActionPanel')
  }

  public exportActionPanels(): void {
    this.fileDownloadService.downloadText(JSON.stringify(this.shelfConfiguration), 'shelf-configuration.json')
  }

  public exportSelectedActionPanels(): void {
    const filteredShelfConfiguration = this.shelfConfiguration.actionPanelConfigurations.filter(panelConfiguration => this.selectedActionPanelIds.has(panelConfiguration.id))
    this.fileDownloadService.downloadText(
      JSON.stringify({
        id: this.shelfConfiguration.id,
        actionPanelConfigurations: filteredShelfConfiguration,
      }),
      'selected-shelf-configuration.json'
    )
    this.selectedActionPanelIds.clear()
  }

  public openDeleteSelectedActionPanelDialog(): void {
    this.dialogService.createConfirmDialog($localize`global.delete-selected.label`, $localize`action-panel.delete-selected.confirmation`, $localize`global.delete.label`, () =>
      this.deleteSelectedActionPanel()
    )
  }

  private deleteSelectedActionPanel(): void {
    const selectedPanelConfigurations = this.shelfConfiguration.actionPanelConfigurations.filter(panelConfiguration => !this.selectedActionPanelIds.has(panelConfiguration.id))
    this.configurationService.updateShelfConfiguration({ id: this.shelfConfiguration.id, actionPanelConfigurations: selectedPanelConfigurations }).subscribe()
  }

  public openDeleteActionPanelDialog(actionPanelIndex: number): void {
    this.dialogService.createConfirmDialog($localize`global.delete.label`, $localize`action-panel.delete.confirmation`, $localize`global.delete.label`, () =>
      this.deleteActionPanelByIndex(actionPanelIndex)
    )
  }

  public deleteActionPanelByIndex(actionPanelIndex: number): void {
    const copyOfShelfConfiguration: ShelfConfiguration = JSON.parse(JSON.stringify(this.shelfConfiguration))
    copyOfShelfConfiguration.actionPanelConfigurations.splice(actionPanelIndex, 1)
    this.configurationService.updateShelfConfiguration(copyOfShelfConfiguration).subscribe()
  }

  public cloneActionPanel(actionPanelIndex: number): void {
    const copyOfShelfConfiguration: ShelfConfiguration = JSON.parse(JSON.stringify(this.shelfConfiguration))
    copyOfShelfConfiguration.actionPanelConfigurations.splice(actionPanelIndex, 0, copyOfShelfConfiguration.actionPanelConfigurations[actionPanelIndex])
    this.configurationService.updateShelfConfiguration(copyOfShelfConfiguration).subscribe()
  }

  public get filteredActionsPanels(): ShelfActionPanelConfiguration[] {
    const lowerCasedSearchQuery: string = this.search.toLocaleLowerCase()
    return this.shelfConfiguration.actionPanelConfigurations.filter(
      actionPanel =>
        this.isFiltersSelectedForPanelConfigurations(actionPanel.actionFilter) &&
        (actionPanel.name.toLocaleLowerCase().includes(lowerCasedSearchQuery) || actionPanel.rank.toString().toLocaleLowerCase().includes(lowerCasedSearchQuery))
    )
  }

  private isFiltersSelectedForPanelConfigurations(panelConfigurationsFilters: Tv2ActionContentType[]): boolean {
    if (this.actionPanelFilters.length === 0) {
      return true
    }
    for (let selectedFilter of this.actionPanelFilters) {
      if (panelConfigurationsFilters.find(filter => filter === selectedFilter)) {
        return true
      }
    }
    return false
  }

  public actionPanelFiltersChange(selectedFiltersIds: string[]): void {
    this.actionPanelFilters = selectedFiltersIds as Tv2ActionContentType[]
  }

  protected readonly IconButton = IconButton
  protected readonly IconButtonSize = IconButtonSize
}
