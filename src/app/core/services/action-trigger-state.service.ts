import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { ActionTrigger, KeyboardTriggerData } from '../../shared/models/action-trigger'
import { ConnectionStatusObserver } from './connection-status-observer.service'
import { ActionTriggerService } from '../../shared/abstractions/action-trigger.service'
import { EventSubscription } from '../../event-system/abstractions/event-observer.service'
import { ActionTriggerCreatedEvent, ActionTriggerDeletedEvent, ActionTriggerUpdatedEvent } from '../models/action-trigger-event'
import { ActionTriggerEventObserver } from '../models/action-trigger-event-observer.service'
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable()
export class ActionTriggerStateService {
  private readonly actionTriggerSubject: BehaviorSubject<ActionTrigger<KeyboardTriggerData>[]> = new BehaviorSubject<ActionTrigger<KeyboardTriggerData>[]>([])

  private readonly subscriptions: EventSubscription[] = []

  constructor(
    private readonly actionTriggerService: ActionTriggerService,
    private readonly connectionStatusObserver: ConnectionStatusObserver,
    private readonly snackBar: MatSnackBar,
    private readonly actionTriggerEventObserver: ActionTriggerEventObserver
  ) {
    this.subscriptions.push(this.connectionStatusObserver.subscribeToReconnect(() => this.resetActionTriggers()))
    this.resetActionTriggers()
    this.subscribeToActionTriggerEvents()
  }

  private resetActionTriggers(): void {
    this.actionTriggerService.getActionTriggers().subscribe(actionTriggers => this.actionTriggerSubject.next(actionTriggers))
  }

  private subscribeToActionTriggerEvents(): void {
    this.subscriptions.push(
      this.actionTriggerEventObserver.subscribeToActionTriggerCreated((actionTriggerCreatedEvent: ActionTriggerCreatedEvent) => this.addCreatedActionTriggerState(actionTriggerCreatedEvent))
    )
    this.subscriptions.push(
      this.actionTriggerEventObserver.subscribeToActionTriggerUpdated((actionTriggerUpdatedEvent: ActionTriggerUpdatedEvent) => this.updateActionTriggerState(actionTriggerUpdatedEvent))
    )
    this.subscriptions.push(
      this.actionTriggerEventObserver.subscribeToActionTriggerDeleted((actionTriggerDeletedEvent: ActionTriggerDeletedEvent) => this.removeActionTriggerState(actionTriggerDeletedEvent))
    )
  }

  private updateActionTriggerState(actionTriggerUpdatedEvent: ActionTriggerUpdatedEvent): void {
    const actionTriggers: ActionTrigger<KeyboardTriggerData>[] = this.actionTriggerSubject.value
    const index: number = actionTriggers.findIndex(actionTrigger => actionTrigger.id === actionTriggerUpdatedEvent.actionTrigger.id)
    if (index === -1) {
      this.openDangerSnackBar('Failed to update shortcut')
      return
    }
    actionTriggers[index] = actionTriggerUpdatedEvent.actionTrigger
    this.actionTriggerSubject.next(actionTriggers)
    this.openSnackBar('Successfully update shortcut')
  }

  private removeActionTriggerState(actionTriggerDeletedEvent: ActionTriggerDeletedEvent): void {
    const actionTriggers: ActionTrigger<KeyboardTriggerData>[] = this.actionTriggerSubject.value
    const index: number = actionTriggers.findIndex(actionTrigger => actionTrigger.id === actionTriggerDeletedEvent.actionTriggerId)
    if (index === -1) {
      // ActionTrigger is already deleted from the state.
      this.openDangerSnackBar('Failed to delete shortcut')
      return
    }
    actionTriggers.splice(index, 1)
    this.actionTriggerSubject.next(actionTriggers)
    this.openSnackBar('Successfully deleted shortcut')
  }

  private addCreatedActionTriggerState(actionTriggerCreatedEvent: ActionTriggerCreatedEvent): void {
    const actionTriggers: ActionTrigger<KeyboardTriggerData>[] = this.actionTriggerSubject.value
    actionTriggers.push(actionTriggerCreatedEvent.actionTrigger as ActionTrigger<KeyboardTriggerData>)
    this.actionTriggerSubject.next(actionTriggers)
    this.openSnackBar('Successfully created shortcut')
  }

  public getActionTriggerObservable(): Observable<ActionTrigger<KeyboardTriggerData>[]> {
    return this.actionTriggerSubject.asObservable()
  }

  public destroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe)
  }

  private openSnackBar(message: string): void {
    this.snackBar.open(message, 'DISMISS', { panelClass: 'snackbar-success' })
  }

  private openDangerSnackBar(message: string): void {
    this.snackBar.open(message, 'DISMISS', { panelClass: 'snackbar-danger' })
  }
}
