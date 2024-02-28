import { Injectable, OnDestroy } from '@angular/core'
import { ConnectionStatusObserver } from '../../core/services/connection-status-observer.service'
import { EventSubscription } from '../../event-system/abstractions/event-observer.service'
import { NotificationService } from './notification.service'

const CONNECTION_NOTIFICATION_ID: string = 'CONNECTION_NOTIFICATION_ID'

@Injectable()
export class ConnectionErrorService implements OnDestroy {
  private readonly subscriptions: EventSubscription[]

  constructor(
    private readonly notificationService: NotificationService,
    private readonly connectionStatusObserver: ConnectionStatusObserver
  ) {
    this.subscriptions = [
      this.connectionStatusObserver.subscribeToClosed(() =>
        this.notificationService.createErrorNotification($localize`:connection-error:Lost connection to backend. Attempting to reconnect...`, CONNECTION_NOTIFICATION_ID)
      ),
      this.connectionStatusObserver.subscribeToReconnect(() => this.notificationService.createInfoNotification('Reconnected to backend.', CONNECTION_NOTIFICATION_ID)),
    ]
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
  }
}
