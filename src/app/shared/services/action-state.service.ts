import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs'
import { Action } from '../models/action'
import { ActionService } from '../abstractions/action.service'
import { Injectable } from '@angular/core'
import { ConnectionStatusObserver } from '../../core/services/connection-status-observer.service'
import { Logger } from '../../core/abstractions/logger.service'
import { EventSubscription } from '../../event-system/abstractions/event-observer.service'
import { RundownEventObserver } from '../../core/services/rundown-event-observer.service'
import { RundownActivatedEvent, RundownDeactivatedEvent } from '../../core/models/rundown-event'

const ALL_ACTIONS = 'ALL_ACTIONSAllActions'
@Injectable()
export class ActionStateService {
  private readonly actionsSubjects: Map<string, BehaviorSubject<Action[]>> = new Map()
  private readonly eventSubscriptions: EventSubscription[]
  private readonly logger: Logger

  constructor(
    private readonly connectionStatusObserver: ConnectionStatusObserver,
    private readonly rundownEventObserver: RundownEventObserver,
    private readonly actionService: ActionService,
    logger: Logger
  ) {
    this.logger = logger.tag('ActionStateService')
    this.eventSubscriptions = [
      this.connectionStatusObserver.subscribeToReconnect(this.onReconnected.bind(this)),
      this.rundownEventObserver.subscribeToRundownActivation(this.onRundownActivated.bind(this)),
      this.rundownEventObserver.subscribeToRundownDeactivation(this.onRundownDeactivated.bind(this)),
    ]
  }

  private onReconnected(): void {
    this.actionsSubjects.forEach((_, rundownId?: string) => this.resetActionsSubject(rundownId))
  }

  private resetActionsSubject(rundownId?: string): void {
    const actionsSubject: BehaviorSubject<Action[]> | undefined = this.getActionsSubject(rundownId)
    if (!actionsSubject) {
      return
    }
    this.logger.debug(`Resetting actions with id: ${rundownId ?? ALL_ACTIONS}`)
    this.fetchActions(rundownId)
      .then(actions => actionsSubject.next(actions))
      .catch(error => this.logger.data(error).error(`Encountered an error while fetching actions for rundown with id '${rundownId ?? ALL_ACTIONS}':`))
  }

  private getActionsSubject(rundownId?: string): BehaviorSubject<Action[]> | undefined {
    const actionsSubject = this.actionsSubjects.get(rundownId ?? ALL_ACTIONS)
    if (!actionsSubject) {
      return
    }
    const wasRemoved: boolean = this.removeSubjectIfItHasNoObservers(actionsSubject, rundownId).wasRemoved
    return wasRemoved ? undefined : actionsSubject
  }

  private removeSubjectIfItHasNoObservers(actionsSubject: BehaviorSubject<Action[]>, rundownId?: string): { wasRemoved: boolean } {
    if (actionsSubject.observed) {
      return { wasRemoved: false }
    }
    actionsSubject.unsubscribe()
    this.actionsSubjects.delete(rundownId ?? ALL_ACTIONS)
    return { wasRemoved: true }
  }

  private onRundownActivated(event: RundownActivatedEvent): void {
    this.resetActionsSubject(event.rundownId)
  }

  private onRundownDeactivated(event: RundownDeactivatedEvent): void {
    this.resetActionsSubject(event.rundownId)
  }

  public async subscribeToRundownActions(rundownId?: string): Promise<Observable<Action[]>> {
    const actionsSubject: BehaviorSubject<Action[]> = await this.createActionsSubject(rundownId)
    return actionsSubject.asObservable()
  }

  private async createActionsSubject(rundownId?: string): Promise<BehaviorSubject<Action[]>> {
    const actionsSubject: BehaviorSubject<Action[]> | undefined = this.actionsSubjects.get(rundownId ?? ALL_ACTIONS)
    if (actionsSubject) {
      return actionsSubject
    }
    const cleanActionsSubject: BehaviorSubject<Action[]> = await this.getCleanActionsSubject(rundownId)
    this.actionsSubjects.set(rundownId ?? ALL_ACTIONS, cleanActionsSubject)
    return cleanActionsSubject
  }

  private async getCleanActionsSubject(rundownId?: string): Promise<BehaviorSubject<Action[]>> {
    const actions: Action[] = await this.fetchActions(rundownId)
    return new BehaviorSubject<Action[]>(actions)
  }

  private fetchActions(rundownId?: string): Promise<Action[]> {
    return lastValueFrom(this.actionService.getActions(rundownId))
  }

  public destroy(): void {
    this.actionsSubjects.forEach(subject => subject.complete())
    this.eventSubscriptions.forEach(eventSubscription => eventSubscription.unsubscribe())
  }
}
