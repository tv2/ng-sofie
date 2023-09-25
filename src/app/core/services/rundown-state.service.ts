import { Injectable, OnDestroy } from '@angular/core'
import {
  RundownAdLibPieceInsertedEvent,
  RundownInfinitePieceAddedEvent,
  PartSetAsNextEvent,
  RundownResetEvent, PartTakenEvent, RundownActivatedEvent, RundownDeactivatedEvent
} from '../models/rundown-event'
import { BehaviorSubject, lastValueFrom, Subscription, SubscriptionLike } from 'rxjs'
import { Rundown } from '../models/rundown';
import { RundownService } from '../abstractions/rundown.service'
import { Segment } from '../models/segment';
import { Part } from '../models/part';
import { RundownEventObserver } from './rundown-event-observer.service'
import { EventSubscription } from '../../event-system/abstractions/event-observer.service'
import { ManagedSubscription } from './managed-subscription.service'
import { ConnectionStatusObserver } from './connection-status-observer.service'

@Injectable()
export class RundownStateService implements OnDestroy {
  private readonly isLoadingSubject: BehaviorSubject<boolean>
  private readonly rundownSubjects: Map<string, BehaviorSubject<Rundown>> = new Map()
  private eventSubscriptions: EventSubscription[]

  private isLoading = true

  constructor(
      private readonly rundownService: RundownService,
      private readonly rundownEventObserver: RundownEventObserver,
      private readonly connectionStatusObserver: ConnectionStatusObserver
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(this.isLoading)
    this.subscribeToEvents()
  }

  private subscribeToEvents(): void {
    const connectionStatusSubscriptions = this.subscribeToConnectionStatus()
    const rundownEventSubscriptions = this.subscribeToRundownEvents()
    this.eventSubscriptions = [
        ...rundownEventSubscriptions,
        ...connectionStatusSubscriptions
      ]
  }

  private subscribeToConnectionStatus(): EventSubscription[] {
    return [
      this.connectionStatusObserver.subscribeToReconnect(this.resetRundownSubjects.bind(this))
    ]
  }

  private resetRundownSubjects(): void {
    for (const [rundownId, rundownSubject] of this.rundownSubjects.entries()) {
      this.resetRundownSubject(rundownSubject, rundownId)
    }
  }

  private resetRundownSubject(rundownSubject: BehaviorSubject<Rundown>, rundownId: string): void {
    console.log('[debug][RundownStateService]', 'Resetting rundown with id: ', rundownId)
    this.fetchRundown(rundownId)
        .then(rundown => rundownSubject.next(rundown))
        .catch(error => console.error('[error]', `Encountered error while fetching rundown with id '${rundownId}':`, error))
  }

  private setIsLoading(isLoading: boolean): void {
    this.isLoading = isLoading
    this.isLoadingSubject.next(this.isLoading)
  }

  private subscribeToRundownEvents(): EventSubscription[] {
    return [
      this.rundownEventObserver.subscribeToRundownActivation(this.activateRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownDeactivation(this.deactivateRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownReset(this.resetRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownTake(this.takePartInRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownSetNext(this.setNextPartInRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownAdLibPieceInserted(this.insertAdLibPieceInRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownInfinitePieceAdded(this.addInfinitePieceToRundownFromEvent.bind(this)),
    ]
  }

  private activateRundownFromEvent(event: RundownActivatedEvent): void {
      const rundownSubject = this.rundownSubjects.get(event.rundownId)
      if (!rundownSubject) {
        return
      }
      rundownSubject.value.activate(event, event.timestamp)
  }

  private deactivateRundownFromEvent(event: RundownDeactivatedEvent): void {
    const rundownSubject = this.rundownSubjects.get(event.rundownId)
    if (!rundownSubject) {
      return
    }
    rundownSubject.value.deactivate(event.timestamp)
  }

  private resetRundownFromEvent(event: RundownResetEvent): void {
    const rundownSubject = this.rundownSubjects.get(event.rundownId)
    if (!rundownSubject) {
      return
    }
    this.resetRundownSubject(rundownSubject, event.rundownId)
  }

  private takePartInRundownFromEvent(event: PartTakenEvent): void {
    const rundownSubject = this.rundownSubjects.get(event.rundownId)
    if (!rundownSubject) {
      return
    }
    rundownSubject.value.takeNext(event, event.timestamp)
  }

  private setNextPartInRundownFromEvent(event: PartSetAsNextEvent): void {
    const rundownSubject = this.rundownSubjects.get(event.rundownId)
    if (!rundownSubject) {
      return
    }
    rundownSubject.value.setNext(event)
  }

  private insertAdLibPieceInRundownFromEvent(event: RundownAdLibPieceInsertedEvent): void {
    const rundownSubject = this.rundownSubjects.get(event.rundownId)
    if (!rundownSubject) {
      return
    }
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

  private addInfinitePieceToRundownFromEvent(event: RundownInfinitePieceAddedEvent): void {
    const rundownSubject = this.rundownSubjects.get(event.rundownId)
    if (!rundownSubject) {
      return
    }
    rundownSubject.value.addInfinitePiece(event.infinitePiece)
  }

  public async subscribeToRundown(rundownId: string, consumer: (rundown: Rundown) => void): Promise<SubscriptionLike> {
    const rundownSubject: BehaviorSubject<Rundown> = await this.getRundownSubject(rundownId)
    const subscription: Subscription = rundownSubject.subscribe(consumer)
    return new ManagedSubscription(subscription, this.createUnsubscribeFromRundownHandler(rundownId))
  }

  private async getRundownSubject(rundownId: string): Promise<BehaviorSubject<Rundown>> {
    this.setIsLoading(true)
    const rundownSubject: BehaviorSubject<Rundown> | undefined = this.rundownSubjects.get(rundownId)
    if (rundownSubject) {
      return rundownSubject
    }
    const cleanRundownSubject = await this.getCleanRundownSubject(rundownId)
    this.rundownSubjects.set(rundownId, cleanRundownSubject)
    this.setIsLoading(false)
    return cleanRundownSubject
  }

  private async getCleanRundownSubject(rundownId: string): Promise<BehaviorSubject<Rundown>> {
    const rundown: Rundown = await this.fetchRundown(rundownId)
    return new BehaviorSubject<Rundown>(rundown)
  }

  public subscribeToLoading(consumer: (isLoading: boolean) => void): SubscriptionLike {
    return this.isLoadingSubject.subscribe(consumer)
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
    this.eventSubscriptions.forEach(eventSubscription => eventSubscription.unsubscribe())
  }
}
