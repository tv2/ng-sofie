import { Injectable, OnDestroy } from '@angular/core'
import {
  RundownAdLibPieceInserted,
  RundownInfinitePieceAddedEvent,
  RundownSetNextEvent,
  RundownResetEvent, RundownTakenEvent, RundownActivatedEvent
} from '../models/rundown-event'
import { BehaviorSubject, lastValueFrom, Subscription, SubscriptionLike } from 'rxjs'
import { Rundown } from '../models/rundown';
import { HttpRundownService } from './http-rundown.service';
import { Segment } from '../models/segment';
import { Part } from '../models/part';
import { RundownEventObserver } from './events/rundown-event-observer.service'
import { Unsubscribe } from '../../event-system/interfaces/event-observer.interface'
import { ManagedSubscription } from './managed-subscription.service'
import { ConnectionStatusObserver } from '../../event-system/services/connection-status-observer.service'

@Injectable()
export class RundownStateService implements OnDestroy {
  private readonly rundownSubjects: Map<string, BehaviorSubject<Rundown>> = new Map()
  private unsubscribeFromEvents: Unsubscribe

  constructor(
      private readonly rundownService: HttpRundownService,
      private readonly rundownEventObserver: RundownEventObserver,
      private readonly connectionStatusObserver: ConnectionStatusObserver
  ) {
    this.registerEventConsumers()
  }

  private registerEventConsumers(): void {
    const unsubscribeFromConnectionStatusEvents = this.registerConnectionStatusConsumers()
    const unsubscribesFromRundownEvents = this.registerRundownEventConsumers()
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
    for (let [rundownId, rundownSubject] of this.rundownSubjects.entries()) {
      this.resetRundownSubject(rundownSubject, rundownId)
    }
  }

  private resetRundownSubject(rundownSubject: BehaviorSubject<Rundown>, rundownId: string): void {
    console.log('[debug][RundownStateService]', 'Resetting rundown with id: ', rundownId)
    this.fetchRundown(rundownId)
        .then(rundown => rundownSubject.next(rundown))
        .catch(error => console.error('[error]', `Encountered error while fetching rundown with id '${rundownId}':`, error))
  }

  private registerRundownEventConsumers(): Unsubscribe[] {
    return [
      this.rundownEventObserver.subscribeToRundownActivation(this.createRundownEventHandler(this.rundownActivationHandler.bind(this))),
      this.rundownEventObserver.subscribeToRundownDeactivation(this.createRundownEventHandler(this.rundownDeactivationHandler.bind(this))),
      this.rundownEventObserver.subscribeToRundownReset(this.createRundownEventHandler(this.rundownResetHandler.bind(this))),
      this.rundownEventObserver.subscribeToRundownTake(this.createRundownEventHandler(this.rundownTakenHandler.bind(this))),
      this.rundownEventObserver.subscribeToRundownSetNext(this.createRundownEventHandler(this.rundownSetNextHandler.bind(this))),
      this.rundownEventObserver.subscribeToRundownAdLibPieceInserted(this.createRundownEventHandler(this.rundownAdLibPieceInsertedHandler.bind(this))),
      this.rundownEventObserver.subscribeToRundownInfinitePieceAdded(this.createRundownEventHandler(this.rundownInfinitePieceAddedHandler.bind(this))),
    ]
  }

  private createRundownEventHandler<EventType extends { rundownId: string }>(handler: (subject: BehaviorSubject<Rundown>, event: EventType) => void): (event: EventType) => void {
    return (event: EventType) => {
      const rundownSubject = this.rundownSubjects.get(event.rundownId)
      if (!rundownSubject) {
        return
      }
      handler(rundownSubject, event)
    }
  }

  private rundownActivationHandler(rundownSubject: BehaviorSubject<Rundown>, event: RundownActivatedEvent): void {
      rundownSubject.value.activate(event)
  }

  private rundownDeactivationHandler(rundownSubject: BehaviorSubject<Rundown>): void {
    rundownSubject.value.deactivate()
  }

  private rundownResetHandler(rundownSubject: BehaviorSubject<Rundown>, event: RundownResetEvent): void {
    this.resetRundownSubject(rundownSubject, event.rundownId)
  }

  private rundownTakenHandler(rundownSubject: BehaviorSubject<Rundown>, event: RundownTakenEvent): void {
    rundownSubject.value.takeNext(event)
  }

  private rundownSetNextHandler(rundownSubject: BehaviorSubject<Rundown>, event: RundownSetNextEvent): void {
    rundownSubject.value.setNext(event)
  }

  private rundownAdLibPieceInsertedHandler(rundownSubject: BehaviorSubject<Rundown>, event: RundownAdLibPieceInserted): void {
    const segment: Segment | undefined = rundownSubject.value.segments.find(segment => segment.id === event.segmentId)
    if (!segment) {
      console.warn('[warn] Failed finding segment for AD_LIB_PIECE_INSERTED for event:', event)
      return
    }

    const part: Part | undefined = segment.parts.find(part => part.id === event.partId)
    if (!part) {
      console.warn('[warn] Failed finding part for AD_LIB_PIECE_INSERTED for event:', event)
      return
    }

    part.insertAdLibPiece(event.adLibPiece)
  }

  private rundownInfinitePieceAddedHandler(rundownSubject: BehaviorSubject<Rundown>, event: RundownInfinitePieceAddedEvent): void {
    rundownSubject.value.addInfinitePiece(event.infinitePiece)
  }

  public async subscribeToRundown(rundownId: string, consumer: (rundown: Rundown) => void): Promise<SubscriptionLike> {
    const rundownSubject: BehaviorSubject<Rundown> = await this.getRundownSubject(rundownId)
    const subscription: Subscription = rundownSubject.subscribe(consumer)
    return new ManagedSubscription(subscription, this.createUnsubscribeFromRundownHandler(rundownId))
  }

  private async getRundownSubject(rundownId: string): Promise<BehaviorSubject<Rundown>> {
    const rundownSubject: BehaviorSubject<Rundown> | undefined = this.rundownSubjects.get(rundownId)
    if (rundownSubject) {
      return rundownSubject
    }
    const cleanRundownSubject = await this.getCleanRundownSubject(rundownId)
    this.rundownSubjects.set(rundownId, cleanRundownSubject)
    return cleanRundownSubject
  }

  private async getCleanRundownSubject(rundownId: string): Promise<BehaviorSubject<Rundown>> {
    const rundown: Rundown = await this.fetchRundown(rundownId)
    return new BehaviorSubject<Rundown>(rundown)
  }

  private fetchRundown(rundownId: string): Promise<Rundown> {
      return lastValueFrom(this.rundownService.fetchRundown(rundownId))
  }

  private createUnsubscribeFromRundownHandler(rundownId: string): () => void {
    return () => this.unsubscribeFromRundown(rundownId)
  }

  private unsubscribeFromRundown(rundownId: string): void {
    const rundownSubject: BehaviorSubject<Rundown> | undefined = this.rundownSubjects.get(rundownId)
    if (!rundownSubject) {
      return
    }
    if (rundownSubject.observed) {
      return
    }
    rundownSubject.unsubscribe()
    this.rundownSubjects.delete(rundownId)
  }

  public ngOnDestroy(): void {
    this.unsubscribeFromEvents()
  }
}
