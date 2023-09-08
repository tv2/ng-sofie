import { Injectable, OnDestroy } from '@angular/core'
import { BehaviorSubject, lastValueFrom, SubscriptionLike } from 'rxjs'
import { RundownEventObserver } from './events/rundown-event-observer.service'
import { Unsubscribe } from './events/event-observer.interface'
import { ConnectionStatusObserver } from './events/connection-status-observer.service'
import { BasicRundown } from '../models/basic-rundown'
import { BasicRundownService } from '../abstractions/basic-rundown-service'
import { RundownEvent } from '../models/rundown-event'

@Injectable()
export class BasicRundownStateService implements OnDestroy {
  private readonly basicRundownsSubject: BehaviorSubject<BasicRundown[]>
  private basicRundowns: BasicRundown[] = []
  private unsubscribeFromEvents?: Unsubscribe

  constructor(
      private readonly basicRundownService: BasicRundownService,
      private readonly rundownEventObserver: RundownEventObserver,
      private readonly connectionStatusObserver: ConnectionStatusObserver
  ) {
    this.basicRundownsSubject = new BehaviorSubject<BasicRundown[]>(this.basicRundowns)
    this.registerEventConsumers()
  }

  private registerEventConsumers(): void {
    const unsubscribeFromConnectionStatusEvents = this.registerConnectionStatusConsumers()
    const unsubscribesFromRundownEvents = this.registerBasicRundownEventConsumers()
    this.unsubscribeFromEvents = () => [
        ...unsubscribesFromRundownEvents,
        ...unsubscribeFromConnectionStatusEvents
      ].forEach(unsubscribe => unsubscribe())
  }

  private registerConnectionStatusConsumers(): Unsubscribe[] {
    return [
      this.connectionStatusObserver.subscribeToConnectionStatus(this.resetBasicRundownSubjectIfConnected.bind(this))
    ]
  }

  private resetBasicRundownSubjectIfConnected(isConnected: boolean): void {
    if (!isConnected) {
      return
    }
    this.resetBasicRundownSubject()
  }

  private resetBasicRundownSubject(): void {
    this.fetchBasicRundowns()
        .then(basicRundowns => this.basicRundowns = basicRundowns)
        .then(() => this.basicRundownsSubject.next(this.basicRundowns))
        .catch(error => console.error('[error]', 'Encountered error while fetching basic rundowns:', error))
  }

  private registerBasicRundownEventConsumers(): Unsubscribe[] {
    return [
      this.rundownEventObserver.subscribeToRundownActivation(this.activateBasicRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownDeactivation(this.deactivateBasicRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownDeletion(this.deleteBasicRundownFromEvent.bind(this)),
      // TODO: Add listener(s) for updating the modifiedAt attribute when we implement modifiedAt.
      // TODO: Add listener(s) for when a rundown is created.
    ]
  }

  private activateBasicRundownFromEvent(event: RundownEvent): void {
    this.basicRundowns = this.basicRundowns.map(basicRundown => {
      if (basicRundown.id === event.rundownId) {
        basicRundown.isActive = true
      }
      return basicRundown
    })
    this.basicRundownsSubject.next(this.basicRundowns)
  }

  private deactivateBasicRundownFromEvent(event: RundownEvent): void {
    this.basicRundowns = this.basicRundowns.map(basicRundown => {
      if (basicRundown.id === event.rundownId) {
        basicRundown.isActive = true
      }
      return basicRundown
    })
    this.basicRundownsSubject.next(this.basicRundowns)
  }

  private deleteBasicRundownFromEvent(event: RundownEvent): void {
    this.basicRundowns = this.basicRundowns.filter(basicRundown => basicRundown.id !== event.rundownId)
    this.basicRundownsSubject.next(this.basicRundowns)
  }

  public subscribeToBasicRundowns(consumer: (basicRundowns: BasicRundown[]) => void): SubscriptionLike {
    return this.basicRundownsSubject.subscribe(consumer)
  }

  private fetchBasicRundowns(): Promise<BasicRundown[]> {
      return lastValueFrom(this.basicRundownService.fetchBasicRundowns())
  }

  public ngOnDestroy(): void {
    this.unsubscribeFromEvents?.()
  }
}
