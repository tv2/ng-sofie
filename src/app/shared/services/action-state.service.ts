import { BehaviorSubject, lastValueFrom, Subject, Subscription, SubscriptionLike } from 'rxjs'
import { Action } from '../models/action'
import { ActionService } from '../abstractions/action.service'
import { ManagedSubscription } from '../../core/services/managed-subscription.service'
import { Injectable } from '@angular/core'
import { ConnectionStatusObserver } from '../../core/services/connection-status-observer.service'
import { Logger } from '../../core/abstractions/logger.service'
import { EventSubscription } from '../../event-system/abstractions/event-observer.service'
import { RundownStateService } from '../../core/services/rundown-state.service'
import { Rundown } from '../../core/models/rundown'

@Injectable()
export class ActionStateService {
  private readonly actionsSubjects: Map<string, BehaviorSubject<Action[]>> = new Map()
  private readonly rundownSubscriptions: Map<string, SubscriptionLike> = new Map()
  private readonly connectionSubscription: EventSubscription
  private readonly logger: Logger

  constructor(
    private readonly connectionStatusObserver: ConnectionStatusObserver,
    private readonly rundownStateService: RundownStateService,
    private readonly actionService: ActionService,
    logger: Logger
  ) {
    this.logger = logger.tag('ActionStateService')
    this.connectionSubscription = this.connectionStatusObserver.subscribeToReconnect(this.onReconnected.bind(this))
  }

  private onReconnected(): void {
    this.actionsSubjects.forEach((actionsSubject: BehaviorSubject<Action[]>, rundownId: string) => this.resetActionsSubject(actionsSubject, rundownId))
  }

  private resetActionsSubject(actionsSubject: Subject<Action[]>, rundownId: string): void {
    this.logger.debug(`Resetting actions with id: ${rundownId}`)
    this.fetchActions(rundownId)
      .then(actions => actionsSubject.next(actions))
      .catch(error => this.logger.data(error).error(`Encountered an error while fetching actions for rundown with id '${rundownId}':`))
  }

  public async subscribeToRundownActions(rundownId: string, onActionsChanged: (actions: Action[]) => void): Promise<SubscriptionLike> {
    const actionsSubject: BehaviorSubject<Action[]> = await this.getActionsSubject(rundownId)
    const subscription: Subscription = actionsSubject.subscribe(onActionsChanged)
    return new ManagedSubscription(subscription, () => this.unsubscribeFromRundownActions(rundownId))
  }

  private async getActionsSubject(rundownId: string): Promise<BehaviorSubject<Action[]>> {
    const actionsSubject: BehaviorSubject<Action[]> | undefined = this.actionsSubjects.get(rundownId)
    if (actionsSubject) {
      return actionsSubject
    }
    const cleanActionsSubject: BehaviorSubject<Action[]> = await this.getCleanActionsSubject(rundownId)
    const rundownSubscription: SubscriptionLike = await this.rundownStateService.subscribeToRundown(rundownId, this.onRundownChanged.bind(this))
    this.rundownSubscriptions.set(rundownId, rundownSubscription)
    this.actionsSubjects.set(rundownId, cleanActionsSubject)
    return cleanActionsSubject
  }

  private async getCleanActionsSubject(rundownId: string): Promise<BehaviorSubject<Action[]>> {
    const actions: Action[] = await this.fetchActions(rundownId)
    return new BehaviorSubject<Action[]>(actions)
  }

  private fetchActions(rundownId: string): Promise<Action[]> {
    return lastValueFrom(this.actionService.getActions(rundownId))
  }

  private onRundownChanged(rundown: Rundown): void {
    const actionSubject: BehaviorSubject<Action[]> | undefined = this.actionsSubjects.get(rundown.id)
    if (!actionSubject) {
      return
    }
    this.resetActionsSubject(actionSubject, rundown.id)
  }

  private unsubscribeFromRundownActions(rundownId: string): void {
    const actionsSubject: BehaviorSubject<Action[]> | undefined = this.actionsSubjects.get(rundownId)
    if (!actionsSubject) {
      return
    }
    if (actionsSubject.observed) {
      return
    }
    actionsSubject.unsubscribe()
    this.actionsSubjects.delete(rundownId)
    this.rundownSubscriptions.delete(rundownId)
  }

  public destroy(): void {
    this.actionsSubjects.forEach(subject => subject.complete())
    this.rundownSubscriptions.forEach(subscription => subscription.unsubscribe())
    this.connectionSubscription.unsubscribe()
  }
}
