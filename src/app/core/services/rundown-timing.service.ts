import { BackwardRundownTiming, RundownTiming } from '../models/rundown-timing'
import { RundownTimingType } from '../enums/rundown-timing-type'
import { Rundown } from '../models/rundown'
import { Segment } from '../models/segment'

export class RundownTimingService {
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

  public getRundownScheduleOffsetInMs(rundown: Rundown): number {
    if (!rundown.isActive) {
      return Date.now() - this.getEndEpochTime(rundown)
    }

    const remainingDuration: number = this.getRemainingRundownDuration(rundown)
    if (remainingDuration + Date.now() > this.getEndEpochTime(rundown)) {
      return remainingDuration
    }
    return -remainingDuration
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

  // TODO: This should also add the remaining time from within the on air segment (use expectedDuration and playedDuration on Parts?)
  private getRemainingRundownDuration(rundown: Rundown): number {
    const nextSegmentIndex: number = rundown.segments.findIndex(segment => segment.isNext)
    if (nextSegmentIndex < 0) {
      throw new Error(`Expected an on air segment in the rundown '${rundown.name}' with id '${rundown.id}'.`)
    }
    return rundown.segments.slice(nextSegmentIndex).reduce((accumulatedEndEpochTime: number, segment: Segment) => accumulatedEndEpochTime + (segment.budgetDuration ?? 0), 0)
  }
}
