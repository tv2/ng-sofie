import { Rundown } from '../models/rundown'
import { BehaviorSubject, Observable, Subscription, SubscriptionLike } from 'rxjs'
import { RundownStateService } from './rundown-state.service'
import { RundownTimingService } from './rundown-timing.service'
import { RundownTimingContext } from '../models/rundown-timing-context'
import { Injectable } from '@angular/core'
import { Segment } from '../models/segment'

const HIGH_RESOLUTION_INTERVAL_DURATION_IN_MS: number = Math.floor(1000 / 30)
const LOW_RESOLUTION_INTERVAL_DURATION_IN_MS: number = Math.floor(1000 / 4)

@Injectable()
export class RundownTimingContextStateService {
  private timeResolutionTimerId?: ReturnType<typeof setTimeout>
  private isHighResolutionTimer: boolean = false
  private readonly rundownSubscriptions: Map<string, SubscriptionLike> = new Map()
  private readonly rundowns: Map<string, Rundown> = new Map()
  private readonly rundownTimingContextSubjects: Map<string, BehaviorSubject<RundownTimingContext>> = new Map()

  constructor(
    private readonly rundownStateService: RundownStateService,
    private readonly rundownTimingService: RundownTimingService
  ) {
    this.startLowResolutionTimer()
  }

  private startLowResolutionTimer(): void {
    this.stopTimeResolutionTimer()
    this.isHighResolutionTimer = false
    this.timeResolutionTimerId = setInterval(this.onTimeTick.bind(this), LOW_RESOLUTION_INTERVAL_DURATION_IN_MS)
  }

  private stopTimeResolutionTimer(): void {
    if (this.timeResolutionTimerId === undefined) {
      return
    }
    clearInterval(this.timeResolutionTimerId)
  }

  private onTimeTick(): void {
    const currentEpochTime: number = Date.now()
    this.rundowns.forEach(rundown => this.updateRundownTimingContextWithEpochTime(rundown, currentEpochTime))
    this.adjustTimerInterval()
  }

  private updateRundownTimingContextWithEpochTime(rundown: Rundown, currentEpochTime: number): void {
    const rundownTimingContextSubject: BehaviorSubject<RundownTimingContext> | undefined = this.getRundownTimingContextSubject(rundown.id)
    if (!rundownTimingContextSubject) {
      return
    }
    const previousRundownTimingContext: RundownTimingContext = rundownTimingContextSubject.value
    const expectedStartEpochTimeForRundown: number = this.rundownTimingService.getExpectedStartEpochTimeForRundown(
      rundown,
      previousRundownTimingContext.expectedDurationInMsForRundown,
      currentEpochTime
    )
    const expectedEndEpochTimeForRundown: number = this.rundownTimingService.getExpectedEndEpochTimeForRundown(rundown, previousRundownTimingContext.expectedDurationInMsForRundown, currentEpochTime)
    const playedDurationInMsForOnAirPart: number = this.rundownTimingService.getPlayedDurationInMsForOnAirPart(rundown, currentEpochTime)
    const playedDurationInMsForOnAirSegment: number = this.rundownTimingService.getPlayedDurationInMsForOnAirSegment(rundown, currentEpochTime)
    const durationInMsSpentInOnAirSegment: number = this.rundownTimingService.getDurationInMsSpentInOnAirSegment(rundown, currentEpochTime)
    const remainingDurationInMs: number = this.rundownTimingService.getRemainingDurationInMsForRundown(
      rundown,
      previousRundownTimingContext.expectedDurationsInMsForSegments,
      playedDurationInMsForOnAirSegment
    )
    const rundownTimingContext: RundownTimingContext = {
      ...previousRundownTimingContext,
      currentEpochTime,
      expectedStartEpochTimeForRundown,
      expectedEndEpochTimeForRundown,
      playedDurationInMsForOnAirPart,
      playedDurationInMsForOnAirSegment,
      durationInMsSpentInOnAirSegment,
      remainingDurationInMsForRundown: remainingDurationInMs,
    }
    rundownTimingContextSubject.next(rundownTimingContext)
  }

  private getRundownTimingContextSubject(rundownId: string): BehaviorSubject<RundownTimingContext> | undefined {
    const rundownTimingContextSubject: BehaviorSubject<RundownTimingContext> | undefined = this.rundownTimingContextSubjects.get(rundownId)
    if (!rundownTimingContextSubject) {
      return
    }
    const wasRemoved: boolean = this.removeSubjectIfHasNoObserversOrSubscriptions(rundownTimingContextSubject, rundownId).wasRemoved
    return wasRemoved ? undefined : rundownTimingContextSubject
  }

  private removeSubjectIfHasNoObserversOrSubscriptions(rundownTimingContextSubject: BehaviorSubject<RundownTimingContext>, rundownId: string): { wasRemoved: boolean } {
    if (rundownTimingContextSubject.observed) {
      return { wasRemoved: false }
    }
    if (this.isDuringSetupOfSubscription(rundownId)) {
      return { wasRemoved: false }
    }
    rundownTimingContextSubject.unsubscribe()
    this.rundownTimingContextSubjects.delete(rundownId)
    this.rundownSubscriptions.get(rundownId)?.unsubscribe()
    this.rundownSubscriptions.delete(rundownId)
    this.rundowns.delete(rundownId)
    return { wasRemoved: true }
  }

  private isDuringSetupOfSubscription(rundownId: string): boolean {
    return !this.rundownSubscriptions.has(rundownId)
  }

  private adjustTimerInterval(): void {
    const hasActiveRundown: boolean = [...this.rundowns.values()].some(rundown => rundown.isActive)
    if (hasActiveRundown && !this.isHighResolutionTimer) {
      this.startHighResolutionTimer()
    } else if (!hasActiveRundown && this.isHighResolutionTimer) {
      this.startLowResolutionTimer()
    }
  }

  public async subscribeToRundownTimingContext(rundownId: string): Promise<Observable<RundownTimingContext>> {
    const rundownTimingContextSubject: BehaviorSubject<RundownTimingContext> = await this.createRundownTimingContextSubject(rundownId)
    return rundownTimingContextSubject.asObservable()
  }

  private async createRundownTimingContextSubject(rundownId: string): Promise<BehaviorSubject<RundownTimingContext>> {
    const rundownTimingContextSubject: BehaviorSubject<RundownTimingContext> | undefined = this.rundownTimingContextSubjects.get(rundownId)
    if (rundownTimingContextSubject) {
      return rundownTimingContextSubject
    }
    const emptyRundownTimingContextSubject: BehaviorSubject<RundownTimingContext> = this.createEmptyRundownTimingContextSubject()
    this.rundownTimingContextSubjects.set(rundownId, emptyRundownTimingContextSubject)
    const rundownObservable: Observable<Rundown> = await this.rundownStateService.subscribeToRundown(rundownId)
    const rundownSubscription: Subscription = rundownObservable.subscribe(this.onRundownChanged.bind(this))
    this.rundownSubscriptions.set(rundownId, rundownSubscription)
    return emptyRundownTimingContextSubject
  }

  private createEmptyRundownTimingContextSubject(): BehaviorSubject<RundownTimingContext> {
    return new BehaviorSubject(this.createEmptyRundownTimingContext())
  }

  private createEmptyRundownTimingContext(): RundownTimingContext {
    return {
      currentEpochTime: Date.now(),
      durationInMsSpentInOnAirSegment: 0,
      expectedDurationInMsForRundown: 0,
      expectedEndEpochTimeForRundown: 0,
      expectedStartEpochTimeForRundown: 0,
      playedDurationInMsForOnAirPart: 0,
      playedDurationInMsForOnAirSegment: 0,
      remainingDurationInMsForRundown: 0,
      expectedDurationsInMsForSegments: {},
      startOffsetsInMsFromNextCursorForSegments: {},
    }
  }

  private onRundownChanged(rundown: Rundown): void {
    const rundownTimingContextSubject: BehaviorSubject<RundownTimingContext> | undefined = this.getRundownTimingContextSubject(rundown.id)
    if (!rundownTimingContextSubject) {
      return
    }
    const onAirSegment: Segment | undefined = rundown.segments.find(segment => segment.isOnAir)
    const currentEpochTime: number = Date.now()
    const expectedDurationsInMsForSegments: Record<string, number> = this.rundownTimingService.getExpectedDurationInMsForSegments(rundown)
    const expectedDurationInMsForRundown: number = this.rundownTimingService.getExpectedDurationInMsForRundown(rundown, expectedDurationsInMsForSegments)
    const expectedStartEpochTimeForRundown: number = this.rundownTimingService.getExpectedStartEpochTimeForRundown(rundown, expectedDurationInMsForRundown, currentEpochTime)
    const expectedEndEpochTimeForRundown: number = this.rundownTimingService.getExpectedEndEpochTimeForRundown(rundown, expectedDurationInMsForRundown, currentEpochTime)
    const playedDurationInMsForOnAirPart: number = this.rundownTimingService.getPlayedDurationInMsForOnAirPart(rundown, currentEpochTime)
    const playedDurationInMsForOnAirSegment: number = this.rundownTimingService.getPlayedDurationInMsForOnAirSegment(rundown, currentEpochTime)
    const durationInMsSpentInOnAirSegment: number = this.rundownTimingService.getDurationInMsSpentInOnAirSegment(rundown, currentEpochTime)
    const remainingDurationInMsForRundown: number = this.rundownTimingService.getRemainingDurationInMsForRundown(rundown, expectedDurationsInMsForSegments, playedDurationInMsForOnAirSegment)
    const rundownTimingContext: RundownTimingContext = {
      onAirSegmentId: onAirSegment?.id,
      currentEpochTime,
      expectedDurationInMsForRundown: expectedDurationInMsForRundown,
      expectedStartEpochTimeForRundown: expectedStartEpochTimeForRundown,
      expectedEndEpochTimeForRundown: expectedEndEpochTimeForRundown,
      remainingDurationInMsForRundown: remainingDurationInMsForRundown,
      playedDurationInMsForOnAirSegment,
      durationInMsSpentInOnAirSegment,
      playedDurationInMsForOnAirPart,
      expectedDurationsInMsForSegments,
      startOffsetsInMsFromNextCursorForSegments: {},
    }
    rundownTimingContextSubject.next(rundownTimingContext)
    this.rundowns.set(rundown.id, rundown)
  }

  private startHighResolutionTimer(): void {
    this.stopTimeResolutionTimer()
    this.isHighResolutionTimer = true
    this.timeResolutionTimerId = setInterval(this.onTimeTick.bind(this), HIGH_RESOLUTION_INTERVAL_DURATION_IN_MS)
  }
}
