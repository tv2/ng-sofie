import { Component, OnDestroy, OnInit } from '@angular/core'
import { ShelfActionPanelConfiguration, ShelfConfiguration } from 'src/app/shared/models/shelf-configuration'
import { ConfigurationService } from '../../../../shared/services/configuration.service'
import { ConfigurationEventObserver } from '../../../../core/services/configuration-event-observer'
import { ShelfConfigurationUpdatedEvent } from '../../../../core/models/configuration-event'
import { EventSubscription } from '../../../../event-system/abstractions/event-observer.service'
import { SofieTableHeader, SortDirection } from '../../../../shared/components/table/table.component'
import { IconButton, IconButtonSize } from 'src/app/shared/enums/icon-button'
import { DialogService } from '../../../../shared/services/dialog.service'
import { EditShelfActionPanelConfigurationDialogComponent } from '../edit-shelf-action-panel-confinguration/edit-shelf-action-panel-configuration-dialog.component'

@Component({
  selector: 'sofie-action-panel',
  templateUrl: './shelf-action-panel-settings-page.component.html',
  styleUrls: ['./shelf-action-panel-settings-page.component.scss'],
})
export class ShelfActionPanelSettingsPageComponent implements OnInit, OnDestroy {
  protected readonly IconButton = IconButton
  protected readonly IconButtonSize = IconButtonSize

  public shelfConfiguration: ShelfConfiguration

  public title: string = $localize`settings.shelf.action-panels.label`

  public readonly headers: SofieTableHeader<ShelfActionPanelConfiguration>[] = [
    {
      name: 'Panel name',
      isBeingUsedForSorting: true,
      sortCallback: (a: ShelfActionPanelConfiguration, b: ShelfActionPanelConfiguration): number => a.name.localeCompare(b.name),
      sortDirection: SortDirection.DESC,
    },
    {
      name: 'Rank',
      sortCallback: (a: ShelfActionPanelConfiguration, b: ShelfActionPanelConfiguration): number => a.rank - b.rank,
      sortDirection: SortDirection.DESC,
    },
    {
      name: 'Filters',
      sortCallback: (a: ShelfActionPanelConfiguration, b: ShelfActionPanelConfiguration): number => a.actionFilter.toString().localeCompare(b.actionFilter.toString()),
      sortDirection: SortDirection.DESC,
    },
  ]

  private readonly selectedActionPanels: Set<ShelfActionPanelConfiguration> = new Set()

  private shelfConfigurationEventSubscription: EventSubscription

  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly configurationEventObserver: ConfigurationEventObserver,
    private readonly dialogService: DialogService
  ) {}

  public ngOnInit(): void {
    this.configurationService.getShelfConfiguration().subscribe(shelfConfiguration => this.updateShelfConfiguration(shelfConfiguration))
    this.shelfConfigurationEventSubscription = this.configurationEventObserver.subscribeToShelfUpdated((shelfConfigurationUpdateEvent: ShelfConfigurationUpdatedEvent) =>
      this.updateShelfConfiguration(shelfConfigurationUpdateEvent.shelfConfiguration)
    )
  }

  private updateShelfConfiguration(shelfConfiguration: ShelfConfiguration): void {
    this.shelfConfiguration = shelfConfiguration
    this.sortPanels()
  }

  public ngOnDestroy(): void {
    this.shelfConfigurationEventSubscription.unsubscribe
  }

  public toggleTableHeaderForSorting(header: SofieTableHeader<ShelfActionPanelConfiguration>): void {
    header.isBeingUsedForSorting = true
    header.sortDirection = header.sortDirection === SortDirection.DESC ? SortDirection.ASC : SortDirection.DESC

    this.headers.forEach(h => {
      if (h === header) {
        return
      }
      h.isBeingUsedForSorting = false
      h.sortDirection = SortDirection.DESC
    })

    this.sortPanels()
  }

  private sortPanels(): void {
    const header: SofieTableHeader<ShelfActionPanelConfiguration> | undefined = this.headers.find(header => header.isBeingUsedForSorting)
    if (!header) {
      return
    }
    this.shelfConfiguration.actionPanelConfigurations.sort(header.sortCallback)
    if (header.sortDirection === SortDirection.DESC) {
      this.shelfConfiguration.actionPanelConfigurations.reverse()
    }
  }

  public getSortIcon(header: SofieTableHeader<ShelfActionPanelConfiguration>): IconButton {
    return header.sortDirection === SortDirection.ASC ? IconButton.SORT_UP : IconButton.SORT_DOWN
  }

  public toggleAllActionPanels(isSelected: boolean): void {
    this.shelfConfiguration.actionPanelConfigurations.forEach(actionPanel => this.toggleActionPanel(isSelected, actionPanel))
  }

  public toggleActionPanel(isSelected: boolean, actionPanel: ShelfActionPanelConfiguration): void {
    if (isSelected) {
      this.selectedActionPanels.add(actionPanel)
      return
    }
    this.selectedActionPanels.delete(actionPanel)
  }

  public isActionPanelSelected(actionPanel: ShelfActionPanelConfiguration): boolean {
    return this.selectedActionPanels.has(actionPanel)
  }

  public isAllActionPanelsSelected(): boolean {
    return this.selectedActionPanels.size === this.shelfConfiguration.actionPanelConfigurations.length
  }

  public deleteActionPanel(actionPanel: ShelfActionPanelConfiguration): void {
    this.dialogService.createConfirmDialog($localize`global.delete.label`, $localize`action-panel.delete.confirmation`, $localize`global.delete.label`, () => {
      const index: number = this.shelfConfiguration.actionPanelConfigurations.indexOf(actionPanel)
      if (index < 0) {
        return
      }
      this.shelfConfiguration.actionPanelConfigurations.splice(index, 1)
      this.configurationService.updateShelfConfiguration(this.shelfConfiguration).subscribe()

      // TODO: Make notification once we have the new notification changes
    })
  }

  public duplicateActionPanel(actionPanel: ShelfActionPanelConfiguration): void {
    const index: number = this.shelfConfiguration.actionPanelConfigurations.indexOf(actionPanel)
    if (index < 0) {
      return
    }
    const duplicatedActionPanel: ShelfActionPanelConfiguration = {
      id: '', // Backend will generate a random id
      name: actionPanel.name,
      rank: actionPanel.rank,
      actionFilter: actionPanel.actionFilter,
    }
    this.shelfConfiguration.actionPanelConfigurations.splice(index, 0, duplicatedActionPanel)
    this.configurationService.updateShelfConfiguration(this.shelfConfiguration).subscribe()
  }

  public openEditActionPanel(actionPanel: ShelfActionPanelConfiguration): void {
    this.dialogService.openSidebarDialog<EditShelfActionPanelConfigurationDialogComponent, ShelfActionPanelConfiguration>(
      EditShelfActionPanelConfigurationDialogComponent,
      actionPanel,
      (result?: ShelfActionPanelConfiguration) => {
        if (!result) {
          return
        }
        const index: number = this.shelfConfiguration.actionPanelConfigurations.findIndex(panel => panel.id === result.id)
        if (index < 0) {
          return
        }
        this.shelfConfiguration.actionPanelConfigurations.splice(index, 1, result)
        this.configurationService.updateShelfConfiguration(this.shelfConfiguration).subscribe()

        // TODO: Make notification once we have the new notification changes
      }
    )
  }
}
