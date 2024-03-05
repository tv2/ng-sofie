import { Component, OnDestroy, OnInit } from '@angular/core'
import { ShelfConfiguration } from 'src/app/shared/models/shelf-configuration'
import { ConfigurationService } from '../../../../shared/services/configuration.service'
import { ConfigurationEventObserver } from '../../../../core/services/configuration-event-observer'
import { ShelfConfigurationUpdatedEvent } from '../../../../core/models/configuration-event'
import { EventSubscription } from '../../../../event-system/abstractions/event-observer.service'

@Component({
  selector: 'sofie-action-panel',
  templateUrl: './shelf-action-panel-settings-page.component.html',
  styleUrls: ['./shelf-action-panel-settings-page.component.scss'],
})
export class ShelfActionPanelSettingsPageComponent implements OnInit, OnDestroy {
  public shelfConfiguration: ShelfConfiguration

  public title: string = $localize`settings.shelf.action-panels.label`

  private shelfConfigurationEventSubscription: EventSubscription

  constructor(
    private readonly shelfConfigurationStateService: ConfigurationService,
    private readonly configurationEventObserver: ConfigurationEventObserver
  ) {}

  public ngOnInit(): void {
    this.shelfConfigurationStateService.getShelfConfiguration().subscribe(shelfConfiguration => (this.shelfConfiguration = shelfConfiguration))
    this.shelfConfigurationEventSubscription = this.configurationEventObserver.subscribeToShelfUpdated(
      (shelfConfigurationUpdateEvent: ShelfConfigurationUpdatedEvent) => (this.shelfConfiguration = shelfConfigurationUpdateEvent.shelfConfiguration)
    )
  }

  public ngOnDestroy(): void {
    this.shelfConfigurationEventSubscription.unsubscribe
  }
}
