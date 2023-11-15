import { Rundown } from '../models/rundown'
import { BehaviorSubject, Observable, Subscription, SubscriptionLike } from 'rxjs'
import { RundownStateService } from './rundown-state.service'
import { RundownTimingService } from './rundown-timing.service'
import { RundownTimingType } from '../enums/rundown-timing-type'
import { RundownTimingContext } from '../models/rundown-timing-context'
import { Injectable } from '@angular/core'

@Injectable()
export class RundownTimingContextStateService {
  private readonly rundownSubscriptions: Map<string, SubscriptionLike> = new Map()
  private readonly rundowns: Map<string, Rundown> = new Map()

  private readonly rundownTimingContextSubjects: Map<string, BehaviorSubject<RundownTimingContext>> = new Map()

  public constructor(
    private readonly rundownStateService: RundownStateService,
    private readonly rundownTimingService: RundownTimingService
  ) {}

  public async subscribeToRundownTimingContext(rundownId: string):  Promise<Observable<RundownTimingContext>> {
    const rundownTimingContextSubject: BehaviorSubject<RundownTimingContext> = await this.createRundownTimingContextSubject(rundownId)
    return rundownTimingContextSubject.asObservable()
  }

  private async createRundownTimingContextSubject(rundownId: string): Promise<BehaviorSubject<RundownTimingContext>> {
    const rundownTimingContextSubject: BehaviorSubject<RundownTimingContext> | undefined = this.rundownTimingContextSubjects.get(rundownId)
    if (rundownTimingContextSubject) {
      return rundownTimingContextSubject
    }
    const rundownObservable: Observable<Rundown> = await this.rundownStateService.subscribeToRundown(rundownId)
    const rundownSubscription: Subscription = rundownObservable.subscribe(this.onRundownChanged.bind(this))
    this.rundownSubscriptions.set(rundownId, rundownSubscription)
    const emptyRundownTimingContextSubject: BehaviorSubject<RundownTimingContext> = await this.createEmptyRundownTimingContextSubject()
    this.rundownTimingContextSubjects.set(rundownId, emptyRundownTimingContextSubject)
    return emptyRundownTimingContextSubject
  }

  private async createEmptyRundownTimingContextSubject(): Promise<BehaviorSubject<RundownTimingContext>> {
    return new BehaviorSubject(this.createEmptyRundownTimingContext())
  }

  private createEmptyRundownTimingContext(): RundownTimingContext {
    return {
      durationInMsSpentInOnAirSegment: 0,
      expectedDurationInMs: 0,
      expectedEndEpochTime: 0,
      expectedStartEpochTime: 0,
      onAirPartTimerDurationInMs: 0,
      onAirSegmentTimerDurationInMs: 0,
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
    const previousRundown: Rundown | undefined = this.rundowns.get(rundown.id)

    const expectedDurationsInMsForSegments: Record<string, number> = this.getExpectedDurationInMsForSegments(rundown, previousRundown)
    const expectedDurationInMs: number = this.getExpectedDurationInMs(rundown, expectedDurationsInMsForSegments)
    const expectedStartEpochTime: number = this.getStartEpochTime(rundown, expectedDurationInMs)
    const expectedEndEpochTime: number = this.getEndEpochTime(rundown, expectedDurationInMs)

    const rundownTimingContext: RundownTimingContext = {
      expectedDurationInMs,
      expectedStartEpochTime,
      expectedEndEpochTime,
      remainingDurationInMs: 0,
      onAirPartTimerDurationInMs: 0,
      onAirSegmentTimerDurationInMs: 0,
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
    const { wasRemoved } = this.removeSubjectIfHasNoObservers(rundownTimingContextSubject, rundownId)
    return wasRemoved ? undefined : rundownTimingContextSubject
  }

  private removeSubjectIfHasNoObservers(rundownTimingContextSubject: BehaviorSubject<RundownTimingContext>, rundownId: string): { wasRemoved: boolean } {
    if (rundownTimingContextSubject.observed) {
      return { wasRemoved: false }
    }
    rundownTimingContextSubject.unsubscribe()
    this.rundownTimingContextSubjects.delete(rundownId)
    this.rundownSubscriptions.get(rundownId)?.unsubscribe()
    this.rundownSubscriptions.delete(rundownId)
    this.rundowns.delete(rundownId)
    return { wasRemoved: true }
  }

  private getExpectedDurationInMsForSegments(rundown: Rundown, previousRundown: Rundown | undefined): Record<string, number> {
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
        return rundown.timing.expectedStartEpochTime ?? (rundown.timing.expectedEndEpochTime - expectedDurationInMs)
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
        return rundown.timing.expectedStartEpochTime ?? (rundown.timing.expectedStartEpochTime + expectedDurationInMs)
      default:
        // TODO: We should set on the rundown when it is activated, in order to show correct start time for unscheduled rundowns.
        return Date.now() + expectedDurationInMs
    }
  }
}
