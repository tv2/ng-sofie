import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { ActionTrigger } from '../../shared/models/action-trigger'
import { ConnectionStatusObserver } from './connection-status-observer.service'
import { ActionTriggerService } from '../../shared/abstractions/action-trigger.service'
import { EventSubscription } from '../../event-system/abstractions/event-observer.service'
import { ActionTriggerCreatedEvent, ActionTriggerDeletedEvent, ActionTriggerUpdatedEvent } from '../models/action-trigger-event'
import { ActionTriggerEventObserver } from '../models/action-trigger-event-observer.service'
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable()
export class ActionTriggerStateService {
  private readonly actionTriggerSubject: BehaviorSubject<ActionTrigger[]> = new BehaviorSubject<ActionTrigger[]>([])

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
      this.actionTriggerEventObserver.subscribeToActionTriggerCreated((actionTriggerCreatedEvent: ActionTriggerCreatedEvent) => this.createActionTriggerFromEvent(actionTriggerCreatedEvent))
    )
    this.subscriptions.push(
      this.actionTriggerEventObserver.subscribeToActionTriggerUpdated((actionTriggerUpdatedEvent: ActionTriggerUpdatedEvent) => this.updateActionTriggerFromEvent(actionTriggerUpdatedEvent))
    )
    this.subscriptions.push(
      this.actionTriggerEventObserver.subscribeToActionTriggerDeleted((actionTriggerDeletedEvent: ActionTriggerDeletedEvent) => this.removeActionTriggerFromEvent(actionTriggerDeletedEvent))
    )
  }

  private updateActionTriggerFromEvent(actionTriggerUpdatedEvent: ActionTriggerUpdatedEvent): void {
    const actionTriggers: ActionTrigger[] = this.actionTriggerSubject.value
    const index: number = actionTriggers.findIndex(actionTrigger => actionTrigger.id === actionTriggerUpdatedEvent.actionTrigger.id)
    if (index === -1) {
      this.openDangerSnackBar('Failed to updated shortcut')
      return
    }
    actionTriggers[index] = actionTriggerUpdatedEvent.actionTrigger
    this.actionTriggerSubject.next(actionTriggers)
    this.openSnackBar('Successfully updated shortcut')
  }

  private removeActionTriggerFromEvent(actionTriggerDeletedEvent: ActionTriggerDeletedEvent): void {
    const actionTriggers: ActionTrigger[] = this.actionTriggerSubject.value
    const index: number = actionTriggers.findIndex(actionTrigger => actionTrigger.id === actionTriggerDeletedEvent.actionTriggerId)
    if (index === -1) {
      // ActionTrigger is already deleted from the state.
      return
    }
    actionTriggers.splice(index, 1)
    this.actionTriggerSubject.next(actionTriggers)
    this.openSnackBar('Successfully deleted shortcut')
  }

  private createActionTriggerFromEvent(actionTriggerCreatedEvent: ActionTriggerCreatedEvent): void {
    const updatedActionTriggers: ActionTrigger[] = [...this.actionTriggerSubject.value, actionTriggerCreatedEvent.actionTrigger]
    this.actionTriggerSubject.next(updatedActionTriggers)
    this.openSnackBar('Successfully created shortcut.')
  }

  public getActionTriggerObservable(): Observable<ActionTrigger[]> {
    return this.actionTriggerSubject.asObservable()
  }

  public destroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe)
  }

  private openSnackBar(message: string): void {
    this.snackBar.open(message, $localize`global.dismiss.label`, { panelClass: 'snackbar-success' })
  }

  private openDangerSnackBar(message: string): void {
    this.snackBar.open(message, $localize`global.dismiss.label`, { panelClass: 'snackbar-danger' })
  }
}
