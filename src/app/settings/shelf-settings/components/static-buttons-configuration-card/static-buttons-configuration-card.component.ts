import { Component, OnDestroy, OnInit } from '@angular/core'
import { Icon, IconSize } from '../../../../shared/enums/icon'
import { Tv2Action } from '../../../../shared/models/tv2-action'
import { ActionStateService } from '../../../../shared/services/action-state.service'
import { Logger } from '../../../../core/abstractions/logger.service'
import { DialogService } from '../../../../shared/services/dialog.service'
import { EditStaticButtonsDialogComponent } from '../edit-static-buttons-dialog/edit-static-buttons-dialog.component'
import { NotificationService } from '../../../../shared/services/notification.service'
import { ConfigurationService } from '../../../../shared/services/configuration.service'
import { ShelfConfiguration } from '../../../../shared/models/shelf-configuration'
import { ShelfConfigurationUpdatedEvent } from '../../../../core/models/configuration-event'
import { EventSubscription } from '../../../../event-system/abstractions/event-observer.service'
import { ConfigurationEventObserver } from '../../../../core/services/configuration-event-observer'
import { Subject, takeUntil } from 'rxjs'

@Component({
  selector: 'sofie-static-buttons-configuration-card',
  templateUrl: './static-buttons-configuration-card.component.html',
  styleUrls: ['./static-buttons-configuration-card.component.scss'],
})
export class StaticButtonsConfigurationCardComponent implements OnInit, OnDestroy {
  public shelfConfiguration: ShelfConfiguration
  public availableActions: Tv2Action[] = []
  public selectedStaticActions: Tv2Action[] = []

  protected readonly IconSize = IconSize
  protected readonly Icon = Icon

  private shelfConfigurationEventSubscription: EventSubscription
  private readonly destroySubject: Subject<void> = new Subject()

  constructor(
    private readonly actionStateService: ActionStateService,
    private readonly dialogService: DialogService,
    private readonly notificationService: NotificationService,
    private readonly configurationService: ConfigurationService,
    private readonly configurationEventObserver: ConfigurationEventObserver,
    private readonly logger: Logger
  ) {
    this.logger.tag('ShelfActionPanelSettingsPageComponent')
    this.configurationService.getShelfConfiguration().subscribe(shelfConfiguration => this.updateShelfConfiguration(shelfConfiguration))
  }

  public ngOnInit(): void {
    this.configurationService
      .getShelfConfiguration()
      .pipe(takeUntil(this.destroySubject))
      .subscribe(shelfConfiguration => {
        this.shelfConfiguration = shelfConfiguration
        this.updateStaticActions()
      })
    this.shelfConfigurationEventSubscription = this.configurationEventObserver.subscribeToShelfUpdated((shelfConfigurationUpdateEvent: ShelfConfigurationUpdatedEvent) => {
      this.updateShelfConfiguration(shelfConfigurationUpdateEvent.shelfConfiguration)
      this.updateStaticActions()
    })
    this.actionStateService
      .subscribeToSystemActions()
      .then(observable => {
        observable.pipe(takeUntil(this.destroySubject)).subscribe(actions => (this.availableActions = actions as Tv2Action[]))
        this.updateStaticActions()
      })
      .catch(error => this.logger.data(error).error('Error while listening to Action events'))
  }

  private updateStaticActions(): void {
    if (!this.shelfConfiguration) {
      return
    }
    this.selectedStaticActions = this.availableActions.filter(action => this.shelfConfiguration.staticActionIds.includes(action.id))
  }

  private updateShelfConfiguration(shelfConfiguration: ShelfConfiguration): void {
    this.shelfConfiguration = shelfConfiguration
  }

  public openEditStaticButtons(): void {
    this.dialogService.openSidebarDialog(
      EditStaticButtonsDialogComponent,
      (updatedSelectedStaticActions?: Tv2Action[]) => {
        if (!updatedSelectedStaticActions) {
          return
        }
        this.shelfConfiguration.staticActionIds = updatedSelectedStaticActions.map(action => action.id)
        this.selectedStaticActions = updatedSelectedStaticActions
        this.configurationService.updateShelfConfiguration(this.shelfConfiguration).subscribe()
        this.notificationService.createInfoNotification($localize`static-buttons-configuration.edit-configuration.success`)
      },
      this.selectedStaticActions
    )
  }

  public ngOnDestroy(): void {
    this.shelfConfigurationEventSubscription.unsubscribe()
  }
}
