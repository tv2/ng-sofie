import { Injectable, OnDestroy } from '@angular/core'
import {
  RundownInfinitePieceAddedEvent,
  PartSetAsNextEvent,
  RundownResetEvent,
  PartTakenEvent,
  RundownActivatedEvent,
  RundownDeactivatedEvent,
  RundownPartInsertedAsOnAirEvent,
  RundownPartInsertedAsNextEvent,
  RundownPieceInsertedEvent,
  RundownUpdatedEvent,
  SegmentUpdatedEvent,
  SegmentDeletedEvent,
  PartCreatedEvent,
  SegmentCreatedEvent,
  PartUpdatedEvent,
  PartDeletedEvent,
  SegmentUnsyncedEvent,
  PartUnsyncedEvent,
  RundownCreatedEvent,
  RundownDeletedEvent,
} from '../models/rundown-event'
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs'
import { Rundown } from '../models/rundown'
import { RundownService } from '../abstractions/rundown.service'
import { RundownEventObserver } from './rundown-event-observer.service'
import { EventSubscription } from '../../event-system/abstractions/event-observer.service'
import { ConnectionStatusObserver } from './connection-status-observer.service'
import { RundownEntityService } from './models/rundown-entity.service'
import { Logger } from '../abstractions/logger.service'

@Injectable()
export class RundownStateService implements OnDestroy {
  private readonly rundownSubjects: Map<string, BehaviorSubject<Rundown | undefined>> = new Map()
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

  private resetRundownSubject(rundownSubject: BehaviorSubject<Rundown | undefined>, rundownId: string): void {
    this.logger.debug(`Resetting rundown with id: ${rundownId}`)
    this.fetchRundown(rundownId)
      .then(rundown => rundownSubject.next(rundown))
      .catch(error => {
        this.logger.data(error).error(`Encountered an error while fetching rundown with id '${rundownId}':`)
        rundownSubject.next(undefined)
      })
  }

  private subscribeToRundownEvents(): EventSubscription[] {
    return [
      //TODO: ADD RUNDOWN DELETED (RETURN UNDEFINED RUNDOWN) AND RUNDOWN CREATED EVENTS)
      this.rundownEventObserver.subscribeToRundownActivation(this.activateRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownDeactivation(this.deactivateRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownCreation(this.createRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownDeletion(this.deleteRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownUpdates(this.updateRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownReset(this.resetRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownTake(this.takePartInRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownSetNext(this.setNextPartInRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownInfinitePieceAdded(this.addInfinitePieceToRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownPartInsertedAsOnAir(this.insertPartAsOnAirFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownPartInsertedAsNext(this.insertPartAsNextFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownPieceInserted(this.insertPieceFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToSegmentCreation(this.createSegmentFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToSegmentUpdates(this.updateSegmentFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToSegmentDeletion(this.deleteSegmentFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToPartCreation(this.createPartFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToPartUpdates(this.updatePartFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToPartDeletion(this.deletePartFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToSegmentUnsync(this.unsyncSegmentFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToPartUnsynced(this.unsyncPartFromEvent.bind(this)),
    ]
  }

  private activateRundownFromEvent(event: RundownActivatedEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    const activeRundown: Rundown = this.rundownEntityService.activate(rundownSubject.value)
    rundownSubject.next(activeRundown)
  }

  private getRundownSubject(rundownId: string): BehaviorSubject<Rundown | undefined> | undefined {
    const rundownSubject = this.rundownSubjects.get(rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    const wasRemoved: boolean = this.removeSubjectIfItHasNoObservers(rundownSubject).wasRemoved
    return wasRemoved ? undefined : rundownSubject
  }

  private removeSubjectIfItHasNoObservers(rundownSubject: BehaviorSubject<Rundown | undefined>): { wasRemoved: boolean } {
    if (rundownSubject.observed) {
      return { wasRemoved: false }
    }
    rundownSubject.unsubscribe()
    if (rundownSubject.value) {
      this.rundownSubjects.delete(rundownSubject.value.id)
    }
    return { wasRemoved: true }
  }

  private deactivateRundownFromEvent(event: RundownDeactivatedEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    const inactiveRundown: Rundown = this.rundownEntityService.deactivate(rundownSubject.value, event.timestamp)
    rundownSubject.next(inactiveRundown)
  }

  private createRundownFromEvent(event: RundownCreatedEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject) {
      this.createRundownSubject(event.rundownId)
        .then(rundownSubject => {
          setTimeout(
            () =>
              void this.fetchRundown(event.rundownId).then(rundown => {
                rundownSubject.next(rundown)
              }),
            500
          )
        })
        .catch(error => this.logger.data(error).warn(`Failed while creating rundown with id '${event.rundownId}':`))
    }
  }

  private updateRundownFromEvent(event: RundownUpdatedEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    const updatedRundown: Rundown = this.rundownEntityService.updateRundownFromBasicRundown(rundownSubject.value, event.basicRundown)
    rundownSubject.next(updatedRundown)
  }

  private deleteRundownFromEvent(event: RundownDeletedEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    rundownSubject.next(undefined)
  }

  private createSegmentFromEvent(event: SegmentCreatedEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    const updatedRundown: Rundown = this.rundownEntityService.createRundownSegment(rundownSubject.value, event.segment)
    rundownSubject.next(updatedRundown)
  }

  private updateSegmentFromEvent(event: SegmentUpdatedEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    const updatedRundown: Rundown = this.rundownEntityService.updateRundownSegment(rundownSubject.value, event.segment)
    rundownSubject.next(updatedRundown)
  }

  private deleteSegmentFromEvent(event: SegmentDeletedEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    const updatedRundown: Rundown = this.rundownEntityService.removeRundownSegment(rundownSubject.value, event.segmentId)
    rundownSubject.next(updatedRundown)
  }

  private unsyncSegmentFromEvent(event: SegmentUnsyncedEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    const updateRundown: Rundown = this.rundownEntityService.unsyncRundownSegment(rundownSubject.value, event.unsyncedSegment, event.originalSegmentId)
    rundownSubject.next(updateRundown)
  }

  private createPartFromEvent(event: PartCreatedEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    const updateRundown: Rundown = this.rundownEntityService.createRundownPart(rundownSubject.value, event.part)
    rundownSubject.next(updateRundown)
  }

  public updatePartFromEvent(event: PartUpdatedEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    const updatedRundown: Rundown = this.rundownEntityService.updateRundownPart(rundownSubject.value, event.part)
    rundownSubject.next(updatedRundown)
  }

  public deletePartFromEvent(event: PartDeletedEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    const updatedRundown: Rundown = this.rundownEntityService.removeRundownPart(rundownSubject.value, event.segmentId, event.partId)
    rundownSubject.next(updatedRundown)
  }

  public unsyncPartFromEvent(event: PartUnsyncedEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    const updatedRundown: Rundown = this.rundownEntityService.unsyncRundownPart(rundownSubject.value, event.part)
    rundownSubject.next(updatedRundown)
  }

  private resetRundownFromEvent(event: RundownResetEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    this.resetRundownSubject(rundownSubject, event.rundownId)
  }

  private takePartInRundownFromEvent(event: PartTakenEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    const { timestamp, ...rundownCursor } = event
    const progressedRundown: Rundown = this.rundownEntityService.takeNext(rundownSubject.value, rundownCursor, timestamp)
    rundownSubject.next(progressedRundown)
  }

  private setNextPartInRundownFromEvent(event: PartSetAsNextEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    const progressedRundown: Rundown = this.rundownEntityService.setNext(rundownSubject.value, event)
    rundownSubject.next(progressedRundown)
  }

  private addInfinitePieceToRundownFromEvent(event: RundownInfinitePieceAddedEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    const rundownWithPiece: Rundown = this.rundownEntityService.addInfinitePiece(rundownSubject.value, event.infinitePiece)
    rundownSubject.next(rundownWithPiece)
  }

  private insertPartAsOnAirFromEvent(event: RundownPartInsertedAsOnAirEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    const rundownWithPart: Rundown = this.rundownEntityService.insertPartAsOnAir(rundownSubject.value, event.part, event.timestamp)
    rundownSubject.next(rundownWithPart)
  }

  private insertPartAsNextFromEvent(event: RundownPartInsertedAsNextEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    const rundownWithPart: Rundown = this.rundownEntityService.insertPartAsNext(rundownSubject.value, event.part)
    rundownSubject.next(rundownWithPart)
  }

  private insertPieceFromEvent(event: RundownPieceInsertedEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    const rundownWithPiece: Rundown = this.rundownEntityService.insertPiece(rundownSubject.value, event, event.piece)
    rundownSubject.next(rundownWithPiece)
  }

  public async subscribeToRundown(rundownId: string): Promise<Observable<Rundown | undefined>> {
    const rundownSubject: BehaviorSubject<Rundown | undefined> = await this.createRundownSubject(rundownId)
    return rundownSubject.asObservable()
  }

  private async createRundownSubject(rundownId: string): Promise<BehaviorSubject<Rundown | undefined>> {
    const rundownSubject: BehaviorSubject<Rundown | undefined> | undefined = this.rundownSubjects.get(rundownId)
    if (rundownSubject) {
      return rundownSubject
    }
    const cleanRundownSubject = await this.getCleanRundownSubject(rundownId)
    this.rundownSubjects.set(rundownId, cleanRundownSubject)
    return cleanRundownSubject
  }

  private async getCleanRundownSubject(rundownId: string): Promise<BehaviorSubject<Rundown | undefined>> {
    try {
      const rundown: Rundown = await this.fetchRundown(rundownId)
      return new BehaviorSubject<Rundown | undefined>(rundown)
    } catch (error) {
      this.logger.data(error).warn(`Failed while fetching rundown with id '${rundownId}' from server:`)
      return new BehaviorSubject<Rundown | undefined>(undefined)
    }
  }

  private fetchRundown(rundownId: string): Promise<Rundown> {
    return lastValueFrom(this.rundownService.fetchRundown(rundownId))
  }

  public ngOnDestroy(): void {
    this.eventSubscriptions.forEach(eventSubscription => eventSubscription.unsubscribe())
  }
}
