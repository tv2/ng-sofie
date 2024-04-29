import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs'
import { Action, ActionArgumentSchemaType } from '../models/action'
import { ActionService } from '../abstractions/action.service'
import { Injectable } from '@angular/core'
import { ConnectionStatusObserver } from '../../core/services/connection-status-observer.service'
import { Logger } from '../../core/abstractions/logger.service'
import { EventSubscription } from '../../event-system/abstractions/event-observer.service'
import { RundownEventObserver } from '../../core/services/rundown-event-observer.service'
import { RundownActivatedEvent, RundownDeactivatedEvent, RundownRehearseEvent } from '../../core/models/rundown-event'
import { Tv2ActionContentType, Tv2ContentPlaceholderAction } from '../models/tv2-action'
import { PlaceholderActionScope, PlaceholderActionType } from '../models/action-type'

const SYSTEM_ACTIONS_ID: string = 'SYSTEM_ACTIONS_ID'

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
      this.rundownEventObserver.subscribeToRundownRehearsal(this.onRundownRehearse.bind(this)),
      this.rundownEventObserver.subscribeToRundownDeactivation(this.onRundownDeactivated.bind(this)),
    ]
  }

  private onReconnected(): void {
    this.actionsSubjects.forEach((_, rundownId: string) => (rundownId === SYSTEM_ACTIONS_ID ? this.resetSystemActionsSubject() : this.resetActionsSubject(rundownId)))
  }

  private resetActionsSubject(rundownId: string): void {
    const actionsSubject: BehaviorSubject<Action[]> | undefined = this.getActionsSubject(rundownId)
    if (!actionsSubject) {
      return
    }
    this.logger.debug(`Resetting actions with id: ${rundownId}`)
    this.fetchActions(rundownId)
      .then(actions => actionsSubject.next(actions))
      .catch(error => this.logger.data(error).error(`Encountered an error while fetching actions for rundown with id '${rundownId}':`))
  }

  private resetSystemActionsSubject(): void {
    const systemActionsSubject: BehaviorSubject<Action[]> | undefined = this.getActionsSubject(SYSTEM_ACTIONS_ID)
    if (!systemActionsSubject) {
      return
    }
    this.logger.debug(`Resetting system actions`)
    this.fetchSystemActions()
      .then(systemActions => systemActionsSubject.next(systemActions))
      .catch(error => this.logger.data(error).error('Encountered an error while fetching system actions.'))
  }

  private getActionsSubject(rundownId: string): BehaviorSubject<Action[]> | undefined {
    const actionsSubject = this.actionsSubjects.get(rundownId)
    if (!actionsSubject) {
      return
    }
    const wasRemoved: boolean = this.removeSubjectIfItHasNoObservers(actionsSubject, rundownId).wasRemoved
    return wasRemoved ? undefined : actionsSubject
  }

  private removeSubjectIfItHasNoObservers(actionsSubject: BehaviorSubject<Action[]>, rundownId: string): { wasRemoved: boolean } {
    if (actionsSubject.observed) {
      return { wasRemoved: false }
    }
    actionsSubject.unsubscribe()
    this.actionsSubjects.delete(rundownId)
    return { wasRemoved: true }
  }

  private onRundownActivated(event: RundownActivatedEvent): void {
    this.resetActionsSubject(event.rundownId)
  }

  private onRundownRehearse(event: RundownRehearseEvent): void {
    this.resetActionsSubject(event.rundownId)
  }

  private onRundownDeactivated(event: RundownDeactivatedEvent): void {
    this.resetActionsSubject(event.rundownId)
  }

  public async subscribeToRundownActions(rundownId: string): Promise<Observable<Action[]>> {
    const actionsSubject: BehaviorSubject<Action[]> = await this.createActionsSubject(rundownId)
    return actionsSubject.asObservable()
  }

  public async subscribeToSystemActions(): Promise<Observable<Action[]>> {
    const actionsSubject: BehaviorSubject<Action[]> = await this.createActionsSubject(SYSTEM_ACTIONS_ID)
    return actionsSubject.asObservable()
  }

  private async createActionsSubject(rundownId: string): Promise<BehaviorSubject<Action[]>> {
    const actionsSubject: BehaviorSubject<Action[]> | undefined = this.actionsSubjects.get(rundownId)
    if (actionsSubject) {
      return actionsSubject
    }
    const cleanActionsSubject: BehaviorSubject<Action[]> = await this.getCleanActionsSubject(rundownId)
    this.actionsSubjects.set(rundownId, cleanActionsSubject)
    return cleanActionsSubject
  }

  private async getCleanActionsSubject(rundownId: string): Promise<BehaviorSubject<Action[]>> {
    const actions: Action[] = await this.fetchActions(rundownId)
    return new BehaviorSubject<Action[]>(actions)
  }

  private async fetchActions(rundownId: string): Promise<Action[]> {
    const actions: Action[] = await lastValueFrom(this.actionService.getActionsByRundownId(rundownId))
    return actions.concat(this.createGraphicsContentPlaceholderAction())
  }

  private async fetchSystemActions(): Promise<Action[]> {
    const actions: Action[] = await lastValueFrom(this.actionService.getSystemActions())
    return actions.concat(this.createGraphicsContentPlaceholderAction())
  }

  public getRundownActions(rundownId: string): Action[] {
    return this.actionsSubjects.get(rundownId)?.value ?? []
  }

  public destroy(): void {
    this.actionsSubjects.forEach(subject => subject.complete())
    this.eventSubscriptions.forEach(eventSubscription => eventSubscription.unsubscribe())
  }

  private createGraphicsContentPlaceholderAction(): Tv2ContentPlaceholderAction {
    return {
      id: 'on_air_graphics_content_placeholder_action',
      name: 'Execute n-th OnAir Graphics',
      description: 'Finds and execute Graphics Actions from the OnAir Segment.',
      rank: 0,
      type: PlaceholderActionType.CONTENT,
      argument: {
        type: ActionArgumentSchemaType.NUMBER,
        name: 'indexToSelect',
        description: 'The n-th Graphics in the OnAir Segment to select. 1 = first, 2 = second etc...',
      },
      metadata: {
        contentType: Tv2ActionContentType.PLACEHOLDER,
        scope: PlaceholderActionScope.ON_AIR_SEGMENT,
        allowedContentTypes: [Tv2ActionContentType.GRAPHICS],
      },
    }
  }
}
