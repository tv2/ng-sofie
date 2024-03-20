import { Injectable, OnDestroy } from '@angular/core'
import {
  RundownInfinitePiecesUpdatedEvent,
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
  RundownRehearseEvent,
} from '../models/rundown-event'
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs'
import { Rundown } from '../models/rundown'
import { RundownService } from '../abstractions/rundown.service'
import { RundownEventObserver } from './rundown-event-observer.service'
import { EventSubscription } from '../../event-system/abstractions/event-observer.service'
import { ConnectionStatusObserver } from './connection-status-observer.service'
import { RundownEntityService } from './models/rundown-entity.service'
import { Logger } from '../abstractions/logger.service'
import { Part } from '../models/part'
import { BasicRundown } from '../models/basic-rundown'
import { RundownMode } from '../enums/rundown-mode'
import { BasicRundownStateService } from './basic-rundown-state.service'
import { DialogService } from '../../shared/services/dialog.service'

@Injectable()
export class RundownStateService implements OnDestroy {
  private readonly rundownSubjects: Map<string, BehaviorSubject<Rundown | undefined>> = new Map()
  private eventSubscriptions: EventSubscription[]
  private readonly logger: Logger

  private readonly onAirPartSubjects: Map<string, BehaviorSubject<Part | undefined>> = new Map()
  private readonly nextPartsSubjects: Map<string, BehaviorSubject<Part | undefined>> = new Map()

  constructor(
    private readonly rundownService: RundownService,
    private readonly basicRundownStateService: BasicRundownStateService,
    private readonly dialogService: DialogService,
    private readonly rundownEventObserver: RundownEventObserver,
    private readonly connectionStatusObserver: ConnectionStatusObserver,
    private readonly rundownEntityService: RundownEntityService,
    logger: Logger
  ) {
    this.logger = logger.tag('RundownStateService')
    this.subscribeToEvents()
  }

  private subscribeToEvents(): void {
    const connectionStatusSubscriptions: EventSubscription[] = this.subscribeToConnectionStatus()
    const rundownEventSubscriptions: EventSubscription[] = this.subscribeToRundownEvents()
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
      this.rundownEventObserver.subscribeToRundownActivation(this.activateRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownRehearsal(this.rehearseRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownDeactivation(this.deactivateRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownCreation(this.createRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownDeletion(this.deleteRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownUpdates(this.updateRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownReset(this.resetRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownTake(this.takePartInRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownSetNext(this.setNextPartInRundownFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownInfinitePiecesUpdated(this.updateInfinitePiecesFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownPartInsertedAsOnAir(this.insertPartAsOnAirFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownPartInsertedAsNext(this.insertPartAsNextFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToRundownPieceInserted(this.insertPieceFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToSegmentCreation(this.insertSegmentFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToSegmentUpdates(this.updateSegmentFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToSegmentDeletion(this.deleteSegmentFromEvent.bind(this)),
      this.rundownEventObserver.subscribeToPartCreation(this.insertPartFromEvent.bind(this)),
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

  private rehearseRundownFromEvent(event: RundownRehearseEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    const activeRundown: Rundown = this.rundownEntityService.rehearse(rundownSubject.value)
    rundownSubject.next(activeRundown)
  }

  private getRundownSubject(rundownId: string): BehaviorSubject<Rundown | undefined> | undefined {
    const rundownSubject = this.rundownSubjects.get(rundownId)
    if (!rundownSubject) {
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
    this.getOnAirPartSubject(event.rundownId)?.next(undefined)
    this.getNextPartSubject(event.rundownId)?.next(undefined)
  }

  private createRundownFromEvent(event: RundownCreatedEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (rundownSubject) {
      rundownSubject.next(event.rundown)
      return
    }
    this.rundownSubjects.set(event.rundownId, new BehaviorSubject<Rundown | undefined>(event.rundown))
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

  private insertSegmentFromEvent(event: SegmentCreatedEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    const updatedRundown: Rundown = this.rundownEntityService.insertSegmentInRundown(rundownSubject.value, event.segment)
    rundownSubject.next(updatedRundown)
  }

  private updateSegmentFromEvent(event: SegmentUpdatedEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    const updatedRundown: Rundown = this.rundownEntityService.updateSegmentInRundown(rundownSubject.value, event.segment)
    rundownSubject.next(updatedRundown)
  }

  private deleteSegmentFromEvent(event: SegmentDeletedEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    const updatedRundown: Rundown = this.rundownEntityService.removeSegmentFromRundown(rundownSubject.value, event.segmentId)
    rundownSubject.next(updatedRundown)
  }

  private unsyncSegmentFromEvent(event: SegmentUnsyncedEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    const updateRundown: Rundown = this.rundownEntityService.unsyncSegmentInRundown(rundownSubject.value, event.unsyncedSegment, event.originalSegmentId)
    rundownSubject.next(updateRundown)
  }

  private insertPartFromEvent(event: PartCreatedEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    const updateRundown: Rundown = this.rundownEntityService.insertPartInSegment(rundownSubject.value, event.part)
    rundownSubject.next(updateRundown)
  }

  public updatePartFromEvent(event: PartUpdatedEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    const updatedRundown: Rundown = this.rundownEntityService.updatePartInSegment(rundownSubject.value, event.part)
    rundownSubject.next(updatedRundown)
  }

  public deletePartFromEvent(event: PartDeletedEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    const updatedRundown: Rundown = this.rundownEntityService.removePartFromSegment(rundownSubject.value, event.segmentId, event.partId)
    rundownSubject.next(updatedRundown)
  }

  public unsyncPartFromEvent(event: PartUnsyncedEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    const updatedRundown: Rundown = this.rundownEntityService.unsyncPartInSegment(rundownSubject.value, event.part)
    rundownSubject.next(updatedRundown)
  }

  private resetRundownFromEvent(event: RundownResetEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    this.resetRundownSubject(rundownSubject, event.rundownId)
    this.getOnAirPartSubject(event.rundownId)?.next(undefined)
    this.getNextPartSubject(event.rundownId)?.next(undefined)
  }

  private takePartInRundownFromEvent(event: PartTakenEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    const { timestamp, ...rundownCursor } = event
    const progressedRundown: Rundown = this.rundownEntityService.takeNext(rundownSubject.value, rundownCursor, timestamp)
    rundownSubject.next(progressedRundown)

    this.updateOnAirPartSubject(progressedRundown, event.segmentId, event.partId)
  }

  private updateOnAirPartSubject(rundown: Rundown, onAirSegmentId: string, onAirPartId: string): void {
    const onAirPart: Part | undefined = rundown.segments.find(segment => segment.id === onAirSegmentId)?.parts.find(part => part.id === onAirPartId)
    const onAirPartSubject: BehaviorSubject<Part | undefined> = this.getOnAirPartSubject(rundown.id)
    onAirPartSubject.next(onAirPart)
  }

  private getOnAirPartSubject(rundownId: string): BehaviorSubject<Part | undefined> {
    if (!this.onAirPartSubjects.has(rundownId)) {
      this.onAirPartSubjects.set(rundownId, new BehaviorSubject<Part | undefined>(this.getOnAirPart(rundownId)))
    }
    return this.onAirPartSubjects.get(rundownId)!
  }

  private getOnAirPart(rundownId: string): Part | undefined {
    return this.rundownSubjects
      .get(rundownId)
      ?.value?.segments.find(segment => segment.isOnAir)
      ?.parts.find(part => part.isOnAir)
  }

  private setNextPartInRundownFromEvent(event: PartSetAsNextEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    const progressedRundown: Rundown = this.rundownEntityService.setNext(rundownSubject.value, event)
    rundownSubject.next(progressedRundown)

    this.updateNextPartSubject(progressedRundown, event.segmentId, event.partId)
  }

  private updateNextPartSubject(rundown: Rundown, nextSegmentId: string, nextPartId: string): void {
    const nextPart: Part | undefined = rundown.segments.find(segment => segment.id === nextSegmentId)?.parts.find(part => part.id === nextPartId)
    const nextPartSubject: BehaviorSubject<Part | undefined> = this.getNextPartSubject(rundown.id)
    nextPartSubject.next(nextPart)
  }

  private getNextPartSubject(rundownId: string): BehaviorSubject<Part | undefined> {
    if (!this.nextPartsSubjects.has(rundownId)) {
      this.nextPartsSubjects.set(rundownId, new BehaviorSubject<Part | undefined>(this.getNextPart(rundownId)))
    }
    return this.nextPartsSubjects.get(rundownId)!
  }

  private getNextPart(rundownId: string): Part | undefined {
    return this.rundownSubjects
      .get(rundownId)
      ?.value?.segments.find(segment => segment.isNext)
      ?.parts.find(part => part.isNext)
  }

  private updateInfinitePiecesFromEvent(event: RundownInfinitePiecesUpdatedEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    const rundownWithPiece: Rundown = this.rundownEntityService.updateInfinitePieces(rundownSubject.value, event.infinitePieces)
    rundownSubject.next(rundownWithPiece)
  }

  private insertPartAsOnAirFromEvent(event: RundownPartInsertedAsOnAirEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    const rundownWithPart: Rundown = this.rundownEntityService.insertPartAsOnAir(rundownSubject.value, event.part, event.timestamp)
    rundownSubject.next(rundownWithPart)

    this.updateOnAirPartSubject(rundownWithPart, event.part.segmentId, event.part.id)
  }

  private insertPartAsNextFromEvent(event: RundownPartInsertedAsNextEvent): void {
    const rundownSubject = this.getRundownSubject(event.rundownId)
    if (!rundownSubject || !rundownSubject.value) {
      return
    }
    const rundownWithPart: Rundown = this.rundownEntityService.insertPartAsNext(rundownSubject.value, event.part)
    rundownSubject.next(rundownWithPart)

    this.updateNextPartSubject(rundownWithPart, event.part.segmentId, event.part.id)
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

  public subscribeToOnAirPart(rundownId: string): Observable<Part | undefined> {
    return this.getOnAirPartSubject(rundownId).asObservable()
  }

  public subscribeToNextPart(rundownId: string): Observable<Part | undefined> {
    return this.getNextPartSubject(rundownId).asObservable()
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

  public switchActivateRundownDialog(rundown: Rundown): void {
    if (rundown.mode === RundownMode.ACTIVE) {
      return
    }
    const nonIdleRundown: BasicRundown | undefined = this.basicRundownStateService.getNonIdleRundown()
    if (!nonIdleRundown) {
      this.rundownService.activate(rundown.id).subscribe()
      return
    }

    switch (true) {
      case nonIdleRundown.mode === RundownMode.REHEARSAL && nonIdleRundown.id === rundown.id:
        this.rundownService.activate(nonIdleRundown.id).subscribe()
        return

      case nonIdleRundown.mode === RundownMode.ACTIVE && nonIdleRundown.id !== rundown.id:
        this.dialogService.createConfirmDialog(rundown.name, `Are you sure you want to activate the Rundown?\n\nThis will deactivate the Rundown "${nonIdleRundown.name}"`, 'Activate', () =>
          this.rundownService.deactivate(nonIdleRundown.id).subscribe(() => this.rundownService.activate(rundown.id).subscribe())
        )
        return

      case nonIdleRundown.mode === RundownMode.REHEARSAL && nonIdleRundown.id !== rundown.id:
        this.rundownService.deactivate(nonIdleRundown.id).subscribe(() => this.rundownService.activate(rundown.id).subscribe())
        return
    }
  }

  public switchRehearsalRundownDialog(rundown: Rundown): void {
    if (rundown.mode === RundownMode.REHEARSAL) {
      return
    }
    const nonIdleRundown: BasicRundown | undefined = this.basicRundownStateService.getNonIdleRundown()
    if (!nonIdleRundown) {
      this.dialogService.createConfirmDialog(rundown.name, 'Are you sure you want to rehearse the Rundown?', 'Rehearse', () => this.rundownService.rehearse(rundown.id).subscribe())
      return
    }
    switch (true) {
      case nonIdleRundown.mode === RundownMode.ACTIVE && nonIdleRundown.id === rundown.id:
        this.dialogService.createConfirmDialog(rundown.name, `Are you sure you want to rehearse the active Rundown?`, 'Rehearse', () => this.rundownService.rehearse(rundown.id).subscribe())
        return
      case nonIdleRundown.mode === RundownMode.REHEARSAL && nonIdleRundown.id !== rundown.id:
        this.rundownService.deactivate(nonIdleRundown.id).subscribe(() => this.rundownService.rehearse(rundown.id).subscribe())
        return
      case nonIdleRundown.mode === RundownMode.ACTIVE && nonIdleRundown.id !== rundown.id:
        this.dialogService.createConfirmDialog(rundown.name, `Are you sure you want to rehearse the Rundown?\n\nThis will deactivate the Rundown "${nonIdleRundown.name}"`, 'Rehearse', () =>
          this.rundownService.deactivate(nonIdleRundown.id).subscribe(() => this.rundownService.rehearse(rundown.id).subscribe())
        )
        return
    }
  }
}
