import { Injectable, OnDestroy } from '@angular/core'
import { RundownInfinitePieceAddedEvent, PartSetAsNextEvent, RundownResetEvent, PartTakenEvent, RundownActivatedEvent, RundownDeactivatedEvent } from '../models/rundown-event'
import { BehaviorSubject, lastValueFrom, Subscription, SubscriptionLike } from 'rxjs'
import { Rundown } from '../models/rundown'
import { RundownService } from '../abstractions/rundown.service'
import { RundownEventObserver } from './rundown-event-observer.service'
import { EventSubscription } from '../../event-system/abstractions/event-observer.service'
import { ManagedSubscription } from './managed-subscription.service'
import { ConnectionStatusObserver } from './connection-status-observer.service'
import { RundownEntityService } from './models/rundown-entity.service'
import { Logger } from '../../../../../../mediatech-logger'

@Injectable()
export class RundownStateService implements OnDestroy {
  private readonly rundownSubjects: Map<string, BehaviorSubject<Rundown>> = new Map()
  private eventSubscriptions: EventSubscription[]
  private readonly logger: Logger

  constructor(
    private readonly rundownService: RundownService,
    private readonly rundownEventObserver: RundownEventObserver,
    private readonly connectionStatusObserver: ConnectionStatusObserver,
    private readonly rundownEntityService: RundownEntityService,
    logger: Logger
  ) {
    this.logger = logger.tag('RundownStateService')
    this.subscribeToEvents()
  }

  private subscribeToEvents(): void {
    const connectionStatusSubscriptions = this.subscribeToConnectionStatus()
    const rundownEventSubscriptions = this.subscribeToRundownEvents()
    this.eventSubscriptions = [...rundownEventSubscriptions, ...connectionStatusSubscriptions]
  }

  private subscribeToConnectionStatus(): EventSubscription[] {
    return [this.connectionStatusObserver.subscribeToReconnect(this.resetRundownSubjects.bind(this))]
  }

  private resetRundownSubjects(): void {
    for (const [rundownId, rundownSubject] of this.rundownSubjects.entries()) {
      this.resetRundownSubject(rundownSubject, rundownId)
    }
  }

  private resetRundownSubject(rundownSubject: BehaviorSubject<Rundown>, rundownId: string): void {
    this.logger.debug(`Resetting rundown with id: ${rundownId}`)
    this.fetchRundown(rundownId)
      .then(rundown => rundownSubject.next(rundown))
      .catch(error => this.logger.data(error).error(`Encountered error while fetching rundown with id '${rundownId}':`))
  }

  private subscribeToRundownEvents(): EventSubscription[] {
    return [
      this.rundownEventObserver.subscribeToRundownActivation(this.activateRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownDeactivation(this.deactivateRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownReset(this.resetRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownTake(this.takePartInRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownSetNext(this.setNextPartInRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownInfinitePieceAdded(this.addInfinitePieceToRundownFromEvent.bind(this)),
    ]
  }

  private activateRundownFromEvent(event: RundownActivatedEvent): void {
    const rundownSubject = this.rundownSubjects.get(event.rundownId)
    if (!rundownSubject) {
      return
    }
    const activeRundown: Rundown = this.rundownEntityService.activate(rundownSubject.value)
    rundownSubject.next(activeRundown)
  }

  private deactivateRundownFromEvent(event: RundownDeactivatedEvent): void {
    const rundownSubject = this.rundownSubjects.get(event.rundownId)
    if (!rundownSubject) {
      return
    }
    const inactiveRundown: Rundown = this.rundownEntityService.deactivate(rundownSubject.value, event.timestamp)
    rundownSubject.next(inactiveRundown)
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
    const { timestamp, ...rundownCursor } = event
    const progressedRundown: Rundown = this.rundownEntityService.takeNext(rundownSubject.value, rundownCursor, timestamp)
    rundownSubject.next(progressedRundown)
  }

  private setNextPartInRundownFromEvent(event: PartSetAsNextEvent): void {
    const rundownSubject = this.rundownSubjects.get(event.rundownId)
    if (!rundownSubject) {
      return
    }
    const progressedRundown: Rundown = this.rundownEntityService.setNext(rundownSubject.value, event)
    rundownSubject.next(progressedRundown)
  }

  private addInfinitePieceToRundownFromEvent(event: RundownInfinitePieceAddedEvent): void {
    const rundownSubject = this.rundownSubjects.get(event.rundownId)
    if (!rundownSubject) {
      return
    }
    // TODO: Out-commented due to current changes in AdLib API. Wait until that is somewhat stable.
    //rundownSubject.value.addInfinitePiece(event.infinitePiece)
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
    this.eventSubscriptions.forEach(eventSubscription => eventSubscription.unsubscribe())
  }
}
