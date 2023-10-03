import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ConnectionStatusObserver } from '../../core/services/connection-status-observer.service'

@Injectable()
export class ConnectionErrorService {
  constructor(private readonly snackBar: MatSnackBar, private readonly connectionStatusObserver: ConnectionStatusObserver) {
    this.connectionStatusObserver.subscribeToClosed(() => this.openDangerSnackBar('Lost connection to backend. Attempting to reconnect...'))
    this.connectionStatusObserver.subscribeToReconnect(() => this.openSnackBar('Reconnected to backend.'))
  }

  private openSnackBar(message: string): void {
    this.snackBar.open(message, 'DISMISS', { panelClass: 'snackbar-success' })
  }

  private openDangerSnackBar(message: string): void {
    this.snackBar.open(message, undefined, { panelClass: 'snackbar-danger', duration: 3000000 })
  }
}
