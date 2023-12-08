import { Injectable, OnDestroy } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { ActionTrigger } from '../../shared/models/action-trigger'
import { ConnectionStatusObserver } from './connection-status-observer.service'
import { ActionTriggerService } from '../../shared/abstractions/action-trigger-service'
import { EventSubscription } from '../../event-system/abstractions/event-observer.service'
import {
  ActionTriggerCreatedEvent,
  ActionTriggerDeletedEvent,
  ActionTriggerUpdatedEvent
} from '../models/action-trigger-event'
import { ActionTriggerEventObserver } from '../models/action-trigger-event-observer.service'

@Injectable()
export class ActionTriggerStateService implements OnDestroy {

  private readonly actionTriggerSubject: BehaviorSubject<ActionTrigger[]> = new BehaviorSubject<ActionTrigger[]>([])

  private readonly subscriptions: EventSubscription[] = []

  constructor(
    private readonly actionTriggerService: ActionTriggerService,
    private readonly connectionStatusObserver: ConnectionStatusObserver,
    private readonly actionTriggerEventObserver: ActionTriggerEventObserver
  ) {
    this.subscriptions.push(this.connectionStatusObserver.subscribeToReconnect(() => this.resetActionTriggers()))
    this.resetActionTriggers()
    this.subscribeToActionTriggerEvents()
  }

  private resetActionTriggers(): void {
    this.actionTriggerService.getActionTriggers()
      .subscribe(actionTriggers => this.actionTriggerSubject.next(actionTriggers))
  }

  private subscribeToActionTriggerEvents(): void {
    this.subscriptions.push(
      this.actionTriggerEventObserver.subscribeToActionTriggerCreated((actionTriggerCreatedEvent: ActionTriggerCreatedEvent) => this.addCreatedActionTrigger(actionTriggerCreatedEvent))
    )
    this.subscriptions.push(
      this.actionTriggerEventObserver.subscribeToActionTriggerUpdated((actionTriggerUpdatedEvent: ActionTriggerUpdatedEvent) => this.updateActionTrigger(actionTriggerUpdatedEvent))
    )
    this.subscriptions.push(
      this.actionTriggerEventObserver.subscribeToActionTriggerDeleted((actionTriggerDeletedEvent: ActionTriggerDeletedEvent) => this.removeActionTrigger(actionTriggerDeletedEvent))
    )
  }

  private addCreatedActionTrigger(actionTriggerCreatedEvent: ActionTriggerCreatedEvent): void {
    const actionTriggers: ActionTrigger[] = this.actionTriggerSubject.value
    actionTriggers.push(actionTriggerCreatedEvent.actionTrigger)
    this.actionTriggerSubject.next(actionTriggers)
  }

  private updateActionTrigger(actionTriggerUpdatedEvent: ActionTriggerUpdatedEvent): void {
    const actionTriggers: ActionTrigger[] = this.actionTriggerSubject.value
    const index: number = actionTriggers.findIndex(actionTrigger => actionTrigger.id === actionTriggerUpdatedEvent.actionTrigger.id)
    if (index === -1) {
      throw new Error(`Updated ActionTrigger does not exist in ActionTrigger state`)
    }

    actionTriggers[index] = actionTriggerUpdatedEvent.actionTrigger
    this.actionTriggerSubject.next(actionTriggers)
  }

  private removeActionTrigger(actionTriggerDeletedEvent: ActionTriggerDeletedEvent): void {
    const actionTriggers: ActionTrigger[] = this.actionTriggerSubject.value
    const index: number = actionTriggers.findIndex(actionTrigger => actionTrigger.id === actionTriggerDeletedEvent.actionTriggerId)
    if (index === -1) {
      // ActionTrigger is already deleted from the state.
      return
    }
    actionTriggers.splice(index, 1)
    this.actionTriggerSubject.next(actionTriggers)
  }

  public getActionTriggerObservable(): Observable<ActionTrigger[]> {
    return this.actionTriggerSubject.asObservable()
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe)
  }
}
