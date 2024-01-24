import { Injectable, OnDestroy } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ConnectionStatusObserver } from '../../core/services/connection-status-observer.service'
import { EventSubscription } from '../../event-system/abstractions/event-observer.service'

@Injectable()
export class ConnectionErrorService implements OnDestroy {
  private readonly subscriptions: EventSubscription[]

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly connectionStatusObserver: ConnectionStatusObserver
  ) {
    this.subscriptions = [
      this.connectionStatusObserver.subscribeToClosed(() => this.openDangerSnackBar($localize`:connection-error:Lost connection to backend. Attempting to reconnect...`)),
      this.connectionStatusObserver.subscribeToReconnect(() => this.openSnackBar('Reconnected to backend.')),
    ]
  }

  private openSnackBar(message: string): void {
    this.snackBar.open(message, $localize`global.dismiss.label`, { panelClass: 'snackbar-success' })
  }

  private openDangerSnackBar(message: string): void {
    this.snackBar.open(message, undefined, { panelClass: 'snackbar-danger', duration: 3000000 })
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
  }
}
