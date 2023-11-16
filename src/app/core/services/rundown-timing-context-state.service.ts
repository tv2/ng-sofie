import { Rundown } from '../models/rundown'
import { BehaviorSubject, Observable, Subscription, SubscriptionLike } from 'rxjs'
import { RundownStateService } from './rundown-state.service'
import { RundownTimingService } from './rundown-timing.service'
import { RundownTimingType } from '../enums/rundown-timing-type'
import { RundownTimingContext } from '../models/rundown-timing-context'
import { Injectable } from '@angular/core'
import { Segment } from '../models/segment'
import { PartEntityService } from './models/part-entity.service'
import { Part } from '../models/part'

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
    private readonly rundownTimingService: RundownTimingService,
    private readonly partEntityService: PartEntityService
  ) {
    this.startLowResolutionTimer()
  }

  public async subscribeToRundownTimingContext(rundownId: string): Promise<Observable<RundownTimingContext>> {
    const rundownTimingContextSubject: BehaviorSubject<RundownTimingContext> = await this.createRundownTimingContextSubject(rundownId)
    return rundownTimingContextSubject.asObservable()
  }

  private startHighResolutionTimer(): void {
    this.stopTimeResolutionTimer()
    this.isHighResolutionTimer = true
    this.timeResolutionTimerId = setInterval(this.onTimeTick.bind(this), HIGH_RESOLUTION_INTERVAL_DURATION_IN_MS)
  }

  private onTimeTick(): void {
    this.rundowns.forEach(rundown => {
      const rundownTimingContextSubject: BehaviorSubject<RundownTimingContext> | undefined = this.getRundownTimingContextSubject(rundown.id)
      if (!rundownTimingContextSubject) {
        return
      }
      const currentEpochTime: number = Date.now()
      const previousRundownTimingContext: RundownTimingContext = rundownTimingContextSubject.value
      const playedDurationInMsForOnAirSegment: number = this.getPlayedDurationInMsForOnAirSegment(rundown)
      const remainingDurationInMs: number = this.getRemainingDurationInMs(rundown, previousRundownTimingContext.expectedDurationsInMsForSegments, playedDurationInMsForOnAirSegment)
      const rundownTimingContext: RundownTimingContext = {
        ...rundownTimingContextSubject.value,
        currentEpochTime,
        playedDurationInMsForOnAirSegment,
        remainingDurationInMs,
      }
      rundownTimingContextSubject.next(rundownTimingContext)
    })

    const hasActiveRundown: boolean = [...this.rundowns.values()].some(rundown => rundown.isActive)
    if (hasActiveRundown && !this.isHighResolutionTimer) {
      this.startHighResolutionTimer()
    } else if (!hasActiveRundown && this.isHighResolutionTimer) {
      this.startLowResolutionTimer()
    }
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
    this.isHighResolutionTimer = false
    clearInterval(this.timeResolutionTimerId)
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
      expectedDurationInMs: 0,
      expectedEndEpochTime: 0,
      expectedStartEpochTime: 0,
      onAirPartTimerDurationInMs: 0,
      playedDurationInMsForOnAirSegment: 0,
      remainingDurationInMs: 0,
      expectedDurationsInMsForSegments: {},
      startOffsetsInMsFromNextCursorForSegments: {},
    }
  }

  private onRundownChanged(rundown: Rundown): void {
    const rundownTimingContextSubject: BehaviorSubject<RundownTimingContext> | undefined = this.getRundownTimingContextSubject(rundown.id)
    if (!rundownTimingContextSubject) {
      return
    }
    const currentEpochTime: number = Date.now()
    const expectedDurationsInMsForSegments: Record<string, number> = this.getExpectedDurationInMsForSegments(rundown)
    const expectedDurationInMs: number = this.getExpectedDurationInMs(rundown, expectedDurationsInMsForSegments)
    const expectedStartEpochTime: number = this.getStartEpochTime(rundown, expectedDurationInMs)
    const expectedEndEpochTime: number = this.getEndEpochTime(rundown, expectedDurationInMs)
    const playedDurationInMsForOnAirSegment: number = this.getPlayedDurationInMsForOnAirSegment(rundown)
    const remainingDurationInMs: number = this.getRemainingDurationInMs(rundown, expectedDurationsInMsForSegments, playedDurationInMsForOnAirSegment)
    const rundownTimingContext: RundownTimingContext = {
      currentEpochTime,
      expectedDurationInMs,
      expectedStartEpochTime,
      expectedEndEpochTime,
      remainingDurationInMs,
      onAirPartTimerDurationInMs: 0,
      playedDurationInMsForOnAirSegment: 0,
      durationInMsSpentInOnAirSegment: 0,
      expectedDurationsInMsForSegments,
      startOffsetsInMsFromNextCursorForSegments: {},
    }
    rundownTimingContextSubject.next(rundownTimingContext)
    this.rundowns.set(rundown.id, rundown)
  }

  private getRundownTimingContextSubject(rundownId: string): BehaviorSubject<RundownTimingContext> | undefined {
    const rundownTimingContextSubject: BehaviorSubject<RundownTimingContext> | undefined = this.rundownTimingContextSubjects.get(rundownId)
    if (!rundownTimingContextSubject) {
      return
    }
    const { wasRemoved } = this.removeSubjectIfHasNoObserversOrSubscriptions(rundownTimingContextSubject, rundownId)
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

  private getExpectedDurationInMsForSegments(rundown: Rundown): Record<string, number> {
    return Object.fromEntries(rundown.segments.map(segment => [segment.id, this.rundownTimingService.getExpectedDurationInMsForSegment(segment)]))
  }

  private getExpectedDurationInMs(rundown: Rundown, expectedDurationsInMsForSegments: Record<string, number>): number {
    return rundown.timing.expectedDurationInMs ?? rundown.segments.reduce((segmentDurationInMsSum, segment) => segmentDurationInMsSum + (expectedDurationsInMsForSegments[segment.id] ?? 0), 0)
  }

  private getStartEpochTime(rundown: Rundown, expectedDurationInMs: number): number {
    switch (rundown.timing.type) {
      case RundownTimingType.FORWARD:
        return rundown.timing.expectedStartEpochTime
      case RundownTimingType.BACKWARD:
        return rundown.timing.expectedStartEpochTime ?? rundown.timing.expectedEndEpochTime - expectedDurationInMs
      default:
        // TODO: We should set on the rundown when it is activated, in order to show correct start time for unscheduled rundowns.
        return Date.now()
    }
  }

  private getEndEpochTime(rundown: Rundown, expectedDurationInMs: number): number {
    switch (rundown.timing.type) {
      case RundownTimingType.BACKWARD:
        return rundown.timing.expectedEndEpochTime
      case RundownTimingType.FORWARD:
        return rundown.timing.expectedStartEpochTime ?? rundown.timing.expectedStartEpochTime + expectedDurationInMs
      default:
        // TODO: We should set on the rundown when it is activated, in order to show correct start time for unscheduled rundowns.
        return Date.now() + expectedDurationInMs
    }
  }

  private getPlayedDurationInMsForOnAirSegment(rundown: Rundown): number {
    // TODO: Should we check for untimed when finding on air segment??
    const onAirSegment: Segment | undefined = rundown.segments.find(segment => segment.isOnAir)
    if (!onAirSegment) {
      return 0
    }
    const onAirPartIndex: number = onAirSegment.parts.findIndex(part => part.isOnAir)
    if (onAirPartIndex < 0) {
      return 0
    }
    const onAirPart: Part = onAirSegment.parts[onAirPartIndex]
    // TODO: Use currentEpochTime for getPlayedDuration instead of Date.now inside
    const playedDurationInMsForOnAirPart: number = this.partEntityService.getPlayedDuration(onAirPart)
    const playedDurationInMsForPastPartsInSegment: number = onAirSegment.parts
      .slice(0, onAirPartIndex)
      .reduce((sumOfPartDurationsInMs, part) => sumOfPartDurationsInMs + this.partEntityService.getDuration(part), 0)
    return playedDurationInMsForPastPartsInSegment + playedDurationInMsForOnAirPart
  }

  private getRemainingDurationInMs(rundown: Rundown, expectedDurationsInMsForSegments: Record<string, number>, playedDurationInMsForOnAirSegment: number): number {
    const remainingDurationInMsForOnAirSegment: number = this.getRemainingDurationInMsForOnAirSegment(rundown, expectedDurationsInMsForSegments, playedDurationInMsForOnAirSegment)
    const remainingDurationInMsFromSegmentMarkedAsNext: number = this.getRemainingDurationInMsFromSegmentMarkedAsNext(rundown, expectedDurationsInMsForSegments)
    return remainingDurationInMsForOnAirSegment + remainingDurationInMsFromSegmentMarkedAsNext
  }

  private getRemainingDurationInMsForOnAirSegment(rundown: Rundown, expectedDurationsInMsForSegments: Record<string, number>, playedDurationInMsForOnAirSegment: number): number {
    const onAirSegment: Segment | undefined = rundown.segments.find(segment => segment.isOnAir && !segment.isUntimed)
    if (!onAirSegment) {
      return 0
    }
    const expectedDurationForOnAirSegment: number = expectedDurationsInMsForSegments[onAirSegment.id] ?? 0
    return Math.max(0, expectedDurationForOnAirSegment - playedDurationInMsForOnAirSegment)
  }

  private getRemainingDurationInMsFromSegmentMarkedAsNext(rundown: Rundown, expectedDurationsInMsForSegments: Record<string, number>): number {
    const nextSegmentIndex: number = rundown.segments.findIndex(segment => segment.isNext)
    if (nextSegmentIndex < 0) {
      return 0
    }
    return rundown.segments
      .slice(nextSegmentIndex)
      .filter(segment => !segment.isOnAir)
      .reduce((sumOfExpectedDurationsInMs, segment) => sumOfExpectedDurationsInMs + expectedDurationsInMsForSegments[segment.id] ?? 0, 0)
  }
}
