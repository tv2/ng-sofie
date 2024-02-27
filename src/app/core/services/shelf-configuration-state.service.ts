import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { ConnectionStatusObserver } from './connection-status-observer.service'
import { EventSubscription } from '../../event-system/abstractions/event-observer.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ConfigurationEventObserver } from './configuration-event-observer'
import { ShelfConfigurationUpdatedEvent } from '../models/configuration-event'
import { ShelfActionPanelConfiguration, ShelfConfiguration } from 'src/app/shared/models/shelf-configuration'
import { ConfigurationService } from 'src/app/shared/services/configuration.service'

@Injectable()
export class ShelfConfigurationStateService {
  private readonly shelfConfigurationSubject: BehaviorSubject<ShelfConfiguration<ShelfActionPanelConfiguration>> = new BehaviorSubject<ShelfConfiguration<ShelfActionPanelConfiguration>>({
    id: '',
    actionPanelConfigurations: [],
  })

  private readonly subscriptions: EventSubscription[] = []

  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly connectionStatusObserver: ConnectionStatusObserver,
    private readonly snackBar: MatSnackBar,
    private readonly configurationEventObserver: ConfigurationEventObserver
  ) {
    this.subscriptions.push(this.connectionStatusObserver.subscribeToReconnect(() => this.resetShelfConfiguration()))
    this.resetShelfConfiguration()
    this.subscribeToActionTriggerEvents()
  }

  private resetShelfConfiguration(): void {
    this.configurationService.getShelfConfiguration().subscribe(shelfConfiguration => this.shelfConfigurationSubject.next(shelfConfiguration))
  }

  private subscribeToActionTriggerEvents(): void {
    this.subscriptions.push(
      this.configurationEventObserver.subscribeToShelfUpdated((shelfConfigurationUpdatedEvent: ShelfConfigurationUpdatedEvent) =>
        this.updateShelfConfigurationFromEvent(shelfConfigurationUpdatedEvent)
      )
    )
  }

  private updateShelfConfigurationFromEvent(shelfConfigurationCreatedEvent: ShelfConfigurationUpdatedEvent): void {
    const updatedShelfConfiguration: ShelfConfiguration<ShelfActionPanelConfiguration> = shelfConfigurationCreatedEvent.shelfConfiguration
    this.shelfConfigurationSubject.next(updatedShelfConfiguration)
    this.openSnackBar('Successfully update shelf configuration.')
  }

  public getShelfConfigurationObservable(): Observable<ShelfConfiguration<ShelfActionPanelConfiguration>> {
    return this.shelfConfigurationSubject.asObservable()
  }

  public destroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe)
  }

  private openSnackBar(message: string): void {
    this.snackBar.open(message, $localize`global.dismiss.label`, { panelClass: 'snackbar-success' })
  }
}
