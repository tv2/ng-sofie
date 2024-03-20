import { Injectable, OnDestroy } from '@angular/core'
import { BehaviorSubject, lastValueFrom, SubscriptionLike } from 'rxjs'
import { RundownEventObserver } from './rundown-event-observer.service'
import { EventSubscription } from '../../event-system/abstractions/event-observer.service'
import { ConnectionStatusObserver } from './connection-status-observer.service'
import { BasicRundown } from '../models/basic-rundown'
import { BasicRundownService } from '../abstractions/basic-rundown.service'
import { RundownCreatedEvent, RundownEvent, RundownUpdatedEvent } from '../models/rundown-event'
import { BasicRundownEntityService } from './models/basic-rundown-entity.service'
import { Logger } from '../abstractions/logger.service'
import { RundownMode } from '../enums/rundown-mode'

@Injectable()
export class BasicRundownStateService implements OnDestroy {
  private readonly basicRundownsSubject: BehaviorSubject<BasicRundown[]>
  private basicRundowns: BasicRundown[] = []
  private eventSubscriptions: EventSubscription[]

  private readonly isLoadingSubject: BehaviorSubject<boolean>
  private isLoading = true

  private readonly logger: Logger

  constructor(
    private readonly basicRundownService: BasicRundownService,
    private readonly rundownEventObserver: RundownEventObserver,
    private readonly connectionStatusObserver: ConnectionStatusObserver,
    private readonly basicRundownEntityService: BasicRundownEntityService,
    logger: Logger
  ) {
    this.logger = logger.tag('BasicRundownStateService')
    this.basicRundownsSubject = new BehaviorSubject<BasicRundown[]>(this.basicRundowns)
    this.isLoadingSubject = new BehaviorSubject<boolean>(this.isLoading)
    this.subscribeToEvents()
    this.resetBasicRundownSubject()
  }

  private subscribeToEvents(): void {
    const connectionStatusSubscriptions = this.subscribeToConnectionStatus()
    const rundownEventSubscriptions = this.subscribeToRundownEvents()
    this.eventSubscriptions = [...rundownEventSubscriptions, ...connectionStatusSubscriptions]
  }

  private subscribeToConnectionStatus(): EventSubscription[] {
    return [this.connectionStatusObserver.subscribeToReconnect(this.resetBasicRundownSubject.bind(this))]
  }

  private resetBasicRundownSubject(): void {
    this.setIsLoading(true)
    this.fetchBasicRundowns()
      .then(basicRundowns => (this.basicRundowns = basicRundowns))
      .then(() => this.basicRundownsSubject.next(this.basicRundowns))
      .catch(error => this.logger.data(error).error('Encountered error while fetching basic rundowns:'))
      .finally(() => this.setIsLoading(false))
  }

  private setIsLoading(isLoading: boolean): void {
    this.isLoading = isLoading
    this.isLoadingSubject.next(this.isLoading)
  }

  private subscribeToRundownEvents(): EventSubscription[] {
    return [
      this.rundownEventObserver.subscribeToRundownActivation(this.activateBasicRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownRehearsal(this.rehearseBasicRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownDeactivation(this.deactivateBasicRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownCreation(this.createBasicRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownUpdates(this.updateBasicRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownDeletion(this.deleteBasicRundownFromEvent.bind(this)),
    ]
  }

  private activateBasicRundownFromEvent(event: RundownEvent): void {
    this.basicRundowns = this.basicRundowns.map(basicRundown => {
      if (basicRundown.id !== event.rundownId) {
        return basicRundown
      }
      return this.basicRundownEntityService.activate(basicRundown)
    })
    this.basicRundownsSubject.next(this.basicRundowns)
  }

  private rehearseBasicRundownFromEvent(event: RundownEvent): void {
    this.basicRundowns = this.basicRundowns.map(basicRundown => {
      if (basicRundown.id !== event.rundownId) {
        return basicRundown
      }
      return this.basicRundownEntityService.rehearse(basicRundown)
    })
    this.basicRundownsSubject.next(this.basicRundowns)
  }

  private deactivateBasicRundownFromEvent(event: RundownEvent): void {
    this.basicRundowns = this.basicRundowns.map(basicRundown => {
      if (basicRundown.id !== event.rundownId) {
        return basicRundown
      }
      return this.basicRundownEntityService.deactivate(basicRundown)
    })
    this.basicRundownsSubject.next(this.basicRundowns)
  }

  private createBasicRundownFromEvent(event: RundownCreatedEvent): void {
    this.basicRundowns = [...this.basicRundowns.filter(basicRundown => basicRundown.id !== event.rundownId), event.rundown]
    this.basicRundownsSubject.next(this.basicRundowns)
  }

  private updateBasicRundownFromEvent(event: RundownUpdatedEvent): void {
    this.basicRundowns = this.basicRundowns.map(basicRundown => (basicRundown.id === event.basicRundown.id ? event.basicRundown : basicRundown))
    this.basicRundownsSubject.next(this.basicRundowns)
  }

  private deleteBasicRundownFromEvent(event: RundownEvent): void {
    this.basicRundowns = this.basicRundowns.filter(basicRundown => basicRundown.id !== event.rundownId)
    this.basicRundownsSubject.next(this.basicRundowns)
  }

  public subscribeToBasicRundowns(consumer: (basicRundowns: BasicRundown[]) => void): SubscriptionLike {
    return this.basicRundownsSubject.subscribe(consumer)
  }

  public subscribeToLoading(consumer: (isLoading: boolean) => void): SubscriptionLike {
    return this.isLoadingSubject.subscribe(consumer)
  }

  private fetchBasicRundowns(): Promise<BasicRundown[]> {
    return lastValueFrom(this.basicRundownService.fetchBasicRundowns())
  }

  public ngOnDestroy(): void {
    this.eventSubscriptions.forEach(eventSubscription => eventSubscription.unsubscribe())
  }

  public getNonIdleRundown(): BasicRundown | undefined {
    return this.basicRundowns.find(rundown => [RundownMode.ACTIVE, RundownMode.REHEARSAL].includes(rundown.mode))
  }
}
