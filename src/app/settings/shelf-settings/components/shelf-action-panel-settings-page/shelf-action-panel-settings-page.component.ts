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
import { ConfigurationParser } from '../../../../shared/abstractions/configuration-parser.service'
import { MultiSelectOption } from '../../../../shared/components/multi-select/multi-select.component'
import { Tv2ActionContentType } from '../../../../shared/models/tv2-action'
import { TranslateActionTypePipe } from '../../../../shared/pipes/translate-action-type.pipe'
import { NotificationService } from '../../../../shared/services/notification.service'

@Component({
  selector: 'sofie-action-panel',
  templateUrl: './shelf-action-panel-settings-page.component.html',
})
export class ShelfActionPanelSettingsPageComponent implements OnInit, OnDestroy {
  protected readonly IconButton = IconButton
  protected readonly IconButtonSize = IconButtonSize
  protected readonly title: string = $localize`settings.shelf.action-panels.label`
  protected readonly shelfConfigurationFileName: string = 'shelf-configuration'

  public selectedActionPanels: Set<ShelfActionPanelConfiguration> = new Set()

  public readonly headers: SofieTableHeader<ShelfActionPanelConfiguration>[] = [
    {
      name: $localize`action-panel.panel-name.label`,
      sortCallback: (a: ShelfActionPanelConfiguration, b: ShelfActionPanelConfiguration): number => a.name.localeCompare(b.name),
      sortDirection: SortDirection.DESC,
    },
    {
      name: $localize`action-panel.rank.label`,
      isBeingUsedForSorting: true,
      sortCallback: (a: ShelfActionPanelConfiguration, b: ShelfActionPanelConfiguration): number => a.rank - b.rank,
      sortDirection: SortDirection.DESC,
    },
    {
      name: $localize`global.filters.label`,
      sortCallback: (a: ShelfActionPanelConfiguration, b: ShelfActionPanelConfiguration): number => a.actionFilter.toString().localeCompare(b.actionFilter.toString()),
      sortDirection: SortDirection.DESC,
    },
  ]

  public shelfConfiguration: ShelfConfiguration

  public actionPanelNameSearchQuery: string
  public actionContentMultiSelectOptions: MultiSelectOption<Tv2ActionContentType>[] = []

  private actionContentQuery: Tv2ActionContentType[] = []

  private shelfConfigurationEventSubscription: EventSubscription

  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly configurationEventObserver: ConfigurationEventObserver,
    private readonly configurationParser: ConfigurationParser,
    private readonly dialogService: DialogService,
    private readonly translationActionTypePipe: TranslateActionTypePipe,
    private readonly notificationService: NotificationService
  ) {}

  public ngOnInit(): void {
    this.configurationService.getShelfConfiguration().subscribe(shelfConfiguration => this.updateShelfConfiguration(shelfConfiguration))
    this.shelfConfigurationEventSubscription = this.configurationEventObserver.subscribeToShelfUpdated((shelfConfigurationUpdateEvent: ShelfConfigurationUpdatedEvent) =>
      this.updateShelfConfiguration(shelfConfigurationUpdateEvent.shelfConfiguration)
    )

    this.actionContentMultiSelectOptions = this.createActionContentMultiSelectOptions()
  }

  private updateShelfConfiguration(shelfConfiguration: ShelfConfiguration): void {
    this.shelfConfiguration = shelfConfiguration
  }

  private createActionContentMultiSelectOptions(): MultiSelectOption<Tv2ActionContentType>[] {
    return Object.values(Tv2ActionContentType).map(actionContent => {
      return {
        name: this.translationActionTypePipe.transform(actionContent),
        value: actionContent,
      }
    })
  }

  public deleteActionPanel(actionPanel: ShelfActionPanelConfiguration): void {
    this.dialogService.createConfirmDialog($localize`global.delete.label`, $localize`action-panel.delete.confirmation`, $localize`global.delete.label`, () => {
      const index: number = this.shelfConfiguration.actionPanelConfigurations.indexOf(actionPanel)
      if (index < 0) {
        return
      }
      this.shelfConfiguration.actionPanelConfigurations.splice(index, 1)
      this.configurationService.updateShelfConfiguration(this.shelfConfiguration).subscribe()

      this.notificationService.createInfoNotification(`Successfully deleted Action Panel: ${actionPanel.name}`)
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

  public openCreateActionPanel(): void {
    this.dialogService.openSidebarDialog<EditShelfActionPanelConfigurationDialogComponent, ShelfActionPanelConfiguration>(
      EditShelfActionPanelConfigurationDialogComponent,
      (result?: ShelfActionPanelConfiguration) => {
        if (!result) {
          return
        }
        this.shelfConfiguration.actionPanelConfigurations.push(result)
        this.configurationService.updateShelfConfiguration(this.shelfConfiguration).subscribe()

        this.notificationService.createInfoNotification(`Successfully created Action Panel: ${result.name}`)
      }
    )
  }

  public openEditActionPanel(actionPanel: ShelfActionPanelConfiguration): void {
    this.dialogService.openSidebarDialog<EditShelfActionPanelConfigurationDialogComponent, ShelfActionPanelConfiguration>(
      EditShelfActionPanelConfigurationDialogComponent,
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

        this.notificationService.createInfoNotification(`Successfully edited Action Panel: ${result.name}`)
      },
      actionPanel
    )
  }

  public shelfConfigurationUploaded(shelfConfiguration: ShelfConfiguration): void {
    this.configurationService.updateShelfConfiguration(shelfConfiguration).subscribe()
  }

  public validateShelfConfiguration(shelfConfiguration: ShelfConfiguration): boolean {
    try {
      return !!this.configurationParser.parseShelfConfiguration(shelfConfiguration)
    } catch {
      return false
    }
  }

  public deleteSelectedActionPanels(): void {
    this.dialogService.createConfirmDialog($localize`global.delete.label`, $localize`action-panel.delete.confirmation`, $localize`global.delete.label`, () => {
      this.shelfConfiguration.actionPanelConfigurations = this.shelfConfiguration.actionPanelConfigurations.filter(actionPanel => !this.selectedActionPanels.has(actionPanel))
      this.selectedActionPanels.clear()
      this.configurationService.updateShelfConfiguration(this.shelfConfiguration).subscribe()

      this.notificationService.createInfoNotification('Selected Action Panels were deleted')
    })
  }

  public updateActionContentQuery(actionContentQuery: Tv2ActionContentType[]): void {
    this.actionContentQuery = actionContentQuery
  }

  public doesActionPanelMatchSearchFilter(actionPanel: ShelfActionPanelConfiguration): boolean {
    const doesNameMatchSearchQuery: boolean = this.doesActionPanelMatchNameSearchQuery(actionPanel)
    const doesActionContentMatchSearchQuery: boolean = this.doesActionPanelMatchActionContentSearchQuery(actionPanel)
    return doesNameMatchSearchQuery && doesActionContentMatchSearchQuery
  }

  private doesActionPanelMatchNameSearchQuery(actionPanel: ShelfActionPanelConfiguration): boolean {
    if (!this.actionPanelNameSearchQuery || this.actionPanelNameSearchQuery.length === 0) {
      return true
    }
    return actionPanel.name.toLowerCase().includes(this.actionPanelNameSearchQuery.toLowerCase())
  }

  private doesActionPanelMatchActionContentSearchQuery(actionPanel: ShelfActionPanelConfiguration): boolean {
    if (this.actionContentQuery.length === 0) {
      return true
    }
    return actionPanel.actionFilter.some(filter => this.actionContentQuery.includes(filter))
  }

  public ngOnDestroy(): void {
    this.shelfConfigurationEventSubscription.unsubscribe
  }
}
