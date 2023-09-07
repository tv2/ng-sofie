import { Injectable, OnDestroy } from '@angular/core'
import { BehaviorSubject, lastValueFrom, SubscriptionLike } from 'rxjs'
import { RundownEventObserver } from './events/rundown-event-observer.service'
import { Unsubscribe } from './events/event-observer.interface'
import { ConnectionStatusObserver } from './events/connection-status-observer.service'
import { BasicRundown } from '../models/basic-rundown'
import { BasicRundownService } from '../interfaces/basic-rundown-service'
import { RundownEvent } from '../models/rundown-event'

@Injectable()
export class BasicRundownStateService implements OnDestroy {
  private readonly basicRundownsSubject: BehaviorSubject<BasicRundown[]> = new BehaviorSubject<BasicRundown[]>([])
  private unsubscribeFromEvents?: Unsubscribe

  constructor(
      private readonly basicRundownService: BasicRundownService,
      private readonly rundownEventObserver: RundownEventObserver,
      private readonly connectionStatusObserver: ConnectionStatusObserver
  ) {
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
    console.log('[debug][RundownStateService]', 'Resetting basic rundowns')
    this.fetchBasicRundowns()
        .then(basicRundowns => this.basicRundownsSubject.next(basicRundowns))
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
    const updatedBasicRundowns = this.basicRundownsSubject.value.map(basicRundown => {
      if (basicRundown.id !== event.rundownId) {
        return basicRundown
      }
      return {
        ...basicRundown,
        isActive: true,
      }
    })
    this.basicRundownsSubject.next(updatedBasicRundowns)
  }

  private deactivateBasicRundownFromEvent(event: RundownEvent): void {
    const updatedBasicRundowns = this.basicRundownsSubject.value.map(basicRundown => {
      if (basicRundown.id !== event.rundownId) {
        return basicRundown
      }
      return {
        ...basicRundown,
        isActive: false,
      }
    })
    this.basicRundownsSubject.next(updatedBasicRundowns)
  }

  private deleteBasicRundownFromEvent(event: RundownEvent): void {
    const updatedBasicRundowns = this.basicRundownsSubject.value.filter(basicRundown => basicRundown.id !== event.rundownId)
    this.basicRundownsSubject.next(updatedBasicRundowns)
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
