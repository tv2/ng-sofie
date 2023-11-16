import { BackwardRundownTiming, RundownTiming } from '../models/rundown-timing'
import { RundownTimingType } from '../enums/rundown-timing-type'
import { Rundown } from '../models/rundown'
import { Segment } from '../models/segment'
import { PartEntityService } from './models/part-entity.service'
import { Part } from '../models/part'
import { Injectable } from '@angular/core'

@Injectable()
export class RundownTimingService {
  constructor(private readonly partEntityService: PartEntityService) {}

  public getExpectedStartEpochTime(rundownTiming: RundownTiming): number | undefined {
    switch (rundownTiming.type) {
      case RundownTimingType.FORWARD:
        return rundownTiming.expectedStartEpochTime
      case RundownTimingType.BACKWARD:
        return this.getExpectedStartFromBackwardRundownTiming(rundownTiming)
      default:
        return undefined
    }
  }

  private getExpectedStartFromBackwardRundownTiming(backwardRundownTiming: BackwardRundownTiming): number | undefined {
    if (backwardRundownTiming.expectedStartEpochTime) {
      return backwardRundownTiming.expectedStartEpochTime
    }

    if (backwardRundownTiming.expectedDurationInMs) {
      return backwardRundownTiming.expectedEndEpochTime - backwardRundownTiming.expectedDurationInMs
    }

    return undefined
  }

  public getExpectedDurationInMs(rundownTiming: RundownTiming): number | undefined {
    return rundownTiming.expectedDurationInMs
  }

  public getExpectedEndEpochTime(rundownTiming: RundownTiming): number | undefined {
    switch (rundownTiming.type) {
      case RundownTimingType.FORWARD:
      case RundownTimingType.BACKWARD:
        return rundownTiming.expectedEndEpochTime
      default:
        return undefined
    }
  }

  private getAggregatedEndEpochTime(rundown: Rundown): number {
    switch (rundown.timing.type) {
      case RundownTimingType.FORWARD:
        return rundown.timing.expectedEndEpochTime ?? rundown.timing.expectedStartEpochTime + this.getAggregatedDurationInMs(rundown)
      case RundownTimingType.BACKWARD:
        return rundown.timing.expectedEndEpochTime
      case RundownTimingType.UNSCHEDULED:
        return Date.now() + this.getRemainingRundownDuration(rundown)
    }
  }

  private getAggregatedDurationInMs(rundown: Rundown): number {
    return rundown.timing.expectedDurationInMs ?? rundown.segments.reduce((accumulatedDurationInMs, segment) => accumulatedDurationInMs + this.getExpectedDurationInMsForSegment(segment), 0)
  }

  public getExpectedDurationInMsForSegment(segment: Segment): number {
    if (segment.isUntimed) {
      return 0
    }
    return segment.budgetDuration ?? segment.parts.reduce((accumulatedPartDuration: number, part: Part) => accumulatedPartDuration + (part.expectedDuration ?? 0), 0)
  }

  public getRundownScheduleOffsetInMs(rundown: Rundown): number {
    if (!rundown.isActive) {
      const rundownPlannedEndEpochTime: number = this.getAggregatedEndEpochTime(rundown)
      const estimatedRundownEndEpochTime: number = Date.now() + this.getAggregatedDurationInMs(rundown)
      return estimatedRundownEndEpochTime - rundownPlannedEndEpochTime
    }

    const remainingDuration: number = this.getRemainingRundownDuration(rundown)
    const estimatedEndEpochTime: number = Date.now() + remainingDuration
    return estimatedEndEpochTime - this.getAggregatedEndEpochTime(rundown)
  }

  public getEndEpochTime(rundown: Rundown): number {
    const expectedEndEpochTime: number | undefined = this.getExpectedEndEpochTime(rundown.timing)
    if (expectedEndEpochTime) {
      return expectedEndEpochTime
    }

    if (!rundown.isActive) {
      const expectedDurationInMs: number = this.getExpectedDurationInMs(rundown.timing) ?? 0
      return Date.now() + expectedDurationInMs
    }

    return Date.now() + this.getRemainingRundownDuration(rundown)
  }

  private getRemainingRundownDuration(rundown: Rundown): number {
    const onAirSegment: Segment | undefined = rundown.segments.filter(segment => !segment.isUntimed).find(segment => segment.isOnAir)
    const remainingOnAirSegmentBudgetDuration: number = onAirSegment?.budgetDuration ? Math.max(0, onAirSegment.budgetDuration - this.getOnAirSegmentPlayedDuration(onAirSegment)) : 0

    const nextSegmentIndex: number = rundown.segments.findIndex(segment => segment.isNext)
    if (nextSegmentIndex < 0) {
      return remainingOnAirSegmentBudgetDuration
    }
    const segmentBudgetRemainingFromNext: number = rundown.segments
      .slice(nextSegmentIndex)
      .filter(segment => !segment.isOnAir && !segment.isUntimed)
      .reduce((accumulatedEndEpochTime: number, segment: Segment) => accumulatedEndEpochTime + this.getExpectedDurationInMsForSegment(segment), 0)
    return segmentBudgetRemainingFromNext + remainingOnAirSegmentBudgetDuration
  }

  private getOnAirSegmentPlayedDuration(onAirSegment: Segment): number {
    const onAirPartIndex: number = onAirSegment.parts.findIndex(part => part.isOnAir)
    const playedPartDuration: number = onAirSegment.parts
      .slice(0, onAirPartIndex)
      .reduce((accumulatedPartDuration: number, part: Part) => accumulatedPartDuration + this.partEntityService.getDuration(part), 0)
    const onAirPartPlayedDuration: number = this.partEntityService.getPlayedDuration(onAirSegment.parts[onAirPartIndex])
    return playedPartDuration + onAirPartPlayedDuration
  }

  public getExpectedDurationInMsForSegments(rundown: Rundown): Record<string, number> {
    return Object.fromEntries(rundown.segments.map(segment => [segment.id, this.getExpectedDurationInMsForSegment(segment)]))
  }

  public getExpectedDurationInMsForRundown(rundown: Rundown, expectedDurationsInMsForSegments: Record<string, number>): number {
    return rundown.timing.expectedDurationInMs ?? rundown.segments.reduce((segmentDurationInMsSum, segment) => segmentDurationInMsSum + (expectedDurationsInMsForSegments[segment.id] ?? 0), 0)
  }

  public getStartEpochTime(rundown: Rundown, expectedDurationInMs: number, currentEpochTime: number): number {
    switch (rundown.timing.type) {
      case RundownTimingType.FORWARD:
        return rundown.timing.expectedStartEpochTime
      case RundownTimingType.BACKWARD:
        return rundown.timing.expectedStartEpochTime ?? rundown.timing.expectedEndEpochTime - expectedDurationInMs
      default:
        // TODO: We should set on the rundown when it is activated, in order to show correct start time for unscheduled rundowns.
        return currentEpochTime
    }
  }
}
