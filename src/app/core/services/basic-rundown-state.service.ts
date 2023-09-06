import { Injectable, OnDestroy } from '@angular/core'
import { BehaviorSubject, lastValueFrom, SubscriptionLike } from 'rxjs'
import { RundownEventObserver } from './events/rundown-event-observer.service'
import { Unsubscribe } from '../../event-system/services/event-observer.interface'
import { ConnectionStatusObserver } from '../../event-system/services/connection-status-observer.service'
import { BasicRundown } from '../models/basic-rundown'
import { BasicRundownService } from '../interfaces/basic-rundown-service.interface'

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
      this.connectionStatusObserver.subscribeToConnectionStatus(this.connectionStatusHandler.bind(this))
    ]
  }

  private connectionStatusHandler(isConnected: boolean): void {
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
      this.rundownEventObserver.subscribeToRundownActivation(this.createBasicRundownEventHandler(this.rundownActivationHandler.bind(this))),
      this.rundownEventObserver.subscribeToRundownDeactivation(this.createBasicRundownEventHandler(this.rundownDeactivationHandler.bind(this))),
      this.rundownEventObserver.subscribeToRundownDeletion(this.createBasicRundownEventHandler(this.rundownDeletionHandler.bind(this))),
      // TODO: Add listener(s) for updating the modifiedAt attribute when we implement modifiedAt.
      // TODO: Add listener(s) for when a rundown is created.
    ]
  }

  private createBasicRundownEventHandler<EventType extends { rundownId: string }>(
      handler: (basicRundown: BasicRundown, event: EventType) => BasicRundown[]
  ): (event: EventType) => void {
    return (event: EventType) => {
      const basicRundowns = this.basicRundownsSubject.value
      const newBasicRundowns: BasicRundown[] = basicRundowns.reduce(this.createBasicRundownReducer(handler, event), [])
      this.basicRundownsSubject.next(newBasicRundowns)
    }
  }

  private createBasicRundownReducer<EventType extends { rundownId: string }>(
      handler: (basicRundown: BasicRundown, event: EventType) => BasicRundown[],
      event: EventType
  ): (basicRundowns: BasicRundown[], basicRundown: BasicRundown) => BasicRundown[] {
    return (basicRundowns: BasicRundown[], basicRundown: BasicRundown) => {
      if (basicRundown.id !== event.rundownId) {
        return [...basicRundowns, basicRundown]
      }
      return [
          ...basicRundowns,
          ...handler(basicRundown, event)
      ]
    }
  }

  private rundownActivationHandler(basicRundown: BasicRundown): BasicRundown[] {
    return [{
      ...basicRundown,
      isActive: true
    }]
  }

  private rundownDeactivationHandler(basicRundown: BasicRundown): BasicRundown[] {
    return [{
      ...basicRundown,
      isActive: false
    }]
  }

  private rundownDeletionHandler(): BasicRundown[] {
    return []
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
