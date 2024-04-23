import { Component, OnDestroy, OnInit } from '@angular/core'
import { ShelfActionPanelConfiguration, ShelfConfiguration } from 'src/app/shared/models/shelf-configuration'
import { ConfigurationService } from '../../../../shared/services/configuration.service'
import { ConfigurationEventObserver } from '../../../../core/services/configuration-event-observer'
import { ShelfConfigurationUpdatedEvent } from '../../../../core/models/configuration-event'
import { EventSubscription } from '../../../../event-system/abstractions/event-observer.service'
import { SofieTableHeader, SortDirection } from '../../../../shared/components/table/table.component'
import { Icon, IconSize } from 'src/app/shared/enums/icon'
import { DialogService } from '../../../../shared/services/dialog.service'
import { ConfigurationParser } from '../../../../shared/abstractions/configuration-parser.service'
import { Tv2ActionContentType } from '../../../../shared/models/tv2-action'
import { TranslateActionTypePipe } from '../../../../shared/pipes/translate-action-type.pipe'
import { NotificationService } from '../../../../shared/services/notification.service'
import { EditShelfActionPanelConfigurationDialogComponent } from '../edit-shelf-action-panel-confinguration-dialog/edit-shelf-action-panel-configuration-dialog.component'
import { SelectOption } from '../../../../shared/models/select-option'
import { DialogColorScheme, DialogSeverity } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component'

@Component({
  selector: 'sofie-action-panel',
  templateUrl: './shelf-action-panel-settings-page.component.html',
  styleUrls: ['./shelf-action-panel-settings-page.component.scss'],
})
export class ShelfActionPanelSettingsPageComponent implements OnInit, OnDestroy {
  protected readonly Icon = Icon
  protected readonly IconSize = IconSize
  protected readonly shelfConfigurationFileName: string = 'shelf-configuration'

  public selectedActionPanels: Set<ShelfActionPanelConfiguration> = new Set()

  public readonly headers: SofieTableHeader<ShelfActionPanelConfiguration>[] = [
    {
      name: $localize`action-panel.panel-name.label`,
      sortCallback: (a: ShelfActionPanelConfiguration, b: ShelfActionPanelConfiguration): number => a.name.localeCompare(b.name),
    },
    {
      name: $localize`action-panel.rank.label`,
      sortCallback: (a: ShelfActionPanelConfiguration, b: ShelfActionPanelConfiguration): number => a.rank - b.rank,
      sortDirection: SortDirection.DESC,
    },
    {
      name: $localize`global.filters.label`,
      sortCallback: (a: ShelfActionPanelConfiguration, b: ShelfActionPanelConfiguration): number => a.actionFilter.toString().localeCompare(b.actionFilter.toString()),
    },
  ]

  public shelfConfiguration: ShelfConfiguration
  public actionPanelNameSearchQuery: string
  public actionContentMultiSelectOptions: SelectOption<Tv2ActionContentType>[] = []

  private actionContentSearchQuery: Tv2ActionContentType[] = []

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

  private createActionContentMultiSelectOptions(): SelectOption<Tv2ActionContentType>[] {
    return Object.values(Tv2ActionContentType).map(actionContent => {
      return {
        name: this.translationActionTypePipe.transform(actionContent),
        value: actionContent,
      }
    })
  }

  public deleteActionPanel(actionPanel: ShelfActionPanelConfiguration): void {
    this.dialogService.createConfirmDialog(
      $localize`global.delete.label`,
      $localize`action-panel.delete.confirmation`,
      $localize`global.delete.label`,
      () => {
        const index: number = this.shelfConfiguration.actionPanelConfigurations.indexOf(actionPanel)
        if (index < 0) {
          return
        }
        this.shelfConfiguration.actionPanelConfigurations.splice(index, 1)
        this.configurationService.updateShelfConfiguration(this.shelfConfiguration).subscribe()

        this.notificationService.createInfoNotification(`Successfully deleted Action Panel: ${actionPanel.name}`)
      },
      DialogColorScheme.LIGHT,
      DialogSeverity.DANGER
    )
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
    this.dialogService.openSidebarDialog(EditShelfActionPanelConfigurationDialogComponent, (createdActionPanel?: ShelfActionPanelConfiguration) => {
      if (!createdActionPanel) {
        return
      }
      this.shelfConfiguration.actionPanelConfigurations.push(createdActionPanel)
      this.configurationService.updateShelfConfiguration(this.shelfConfiguration).subscribe()

      this.notificationService.createInfoNotification($localize`shelf-action-panel-settings-page.create-action-panel.success ${createdActionPanel.name}`)
    })
  }

  public openEditActionPanel(actionPanel: ShelfActionPanelConfiguration): void {
    this.dialogService.openSidebarDialog(
      EditShelfActionPanelConfigurationDialogComponent,
      (updatedActionPanel?: ShelfActionPanelConfiguration) => {
        if (!updatedActionPanel) {
          return
        }
        const index: number = this.shelfConfiguration.actionPanelConfigurations.findIndex(panel => panel.id === updatedActionPanel.id)
        if (index < 0) {
          return
        }
        this.shelfConfiguration.actionPanelConfigurations.splice(index, 1, updatedActionPanel)
        this.configurationService.updateShelfConfiguration(this.shelfConfiguration).subscribe()

        this.notificationService.createInfoNotification($localize`shelf-action-panel-settings.page.update-action-panel.success ${updatedActionPanel.name}`)
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
    this.dialogService.createConfirmDialog(
      $localize`global.delete.label`,
      $localize`action-panel.delete.confirmation`,
      $localize`global.delete.label`,
      () => {
        this.shelfConfiguration.actionPanelConfigurations = this.shelfConfiguration.actionPanelConfigurations.filter(actionPanel => !this.selectedActionPanels.has(actionPanel))
        this.selectedActionPanels.clear()
        this.configurationService.updateShelfConfiguration(this.shelfConfiguration).subscribe()

        this.notificationService.createInfoNotification($localize`shelf-action-panel-settings-page.selected-action-panels.deleted`)
      },
      DialogColorScheme.LIGHT,
      DialogSeverity.DANGER
    )
  }

  public updateActionContentQuery(actionContentQuery: Tv2ActionContentType[]): void {
    this.actionContentSearchQuery = actionContentQuery
  }

  public doesActionPanelMatchSearchFilter(actionPanel: ShelfActionPanelConfiguration): boolean {
    const doesNameMatchSearchQuery: boolean = this.doesActionPanelMatchNameSearchQuery(actionPanel)
    const doesActionContentMatchSearchQuery: boolean = this.doesActionPanelMatchActionContentSearchQuery(actionPanel)
    return doesNameMatchSearchQuery && doesActionContentMatchSearchQuery
  }

  private doesActionPanelMatchNameSearchQuery(actionPanel: ShelfActionPanelConfiguration): boolean {
    if (!this.actionPanelNameSearchQuery) {
      return true
    }
    return actionPanel.name.toLowerCase().includes(this.actionPanelNameSearchQuery.toLowerCase())
  }

  private doesActionPanelMatchActionContentSearchQuery(actionPanel: ShelfActionPanelConfiguration): boolean {
    if (this.actionContentSearchQuery.length === 0) {
      return true
    }
    return actionPanel.actionFilter.some(filter => this.actionContentSearchQuery.includes(filter))
  }

  public ngOnDestroy(): void {
    this.shelfConfigurationEventSubscription.unsubscribe()
  }
}
