import { RundownTimingType } from '../enums/rundown-timing-type'
import { Rundown } from '../models/rundown'
import { Segment } from '../models/segment'
import { PartEntityService } from './models/part-entity.service'
import { Part } from '../models/part'
import { Injectable } from '@angular/core'

@Injectable()
export class RundownTimingService {
  constructor(private readonly partEntityService: PartEntityService) {}

  public getExpectedDurationInMsForSegments(rundown: Rundown): Record<string, number> {
    return Object.fromEntries(rundown.segments.map(segment => [segment.id, this.getExpectedDurationInMsForSegment(segment)]))
  }

  public getExpectedDurationInMsForSegment(segment: Segment): number {
    if (segment.isUntimed) {
      return 0
    }
    return segment.expectedDurationInMs ?? segment.parts.reduce((sumOfExpectedDurationsInMsForParts: number, part: Part) => sumOfExpectedDurationsInMsForParts + (part.expectedDuration ?? 0), 0)
  }

  public getExpectedDurationInMsForRundown(rundown: Rundown, expectedDurationsInMsForSegments: Record<string, number>): number {
    return rundown.timing.expectedDurationInMs ?? rundown.segments.reduce((segmentDurationInMsSum, segment) => segmentDurationInMsSum + (expectedDurationsInMsForSegments[segment.id] ?? 0), 0)
  }

  public getExpectedStartEpochTimeForRundown(rundown: Rundown, expectedDurationInMs: number, currentEpochTime: number): number {
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

  public getExpectedEndEpochTimeForRundown(rundown: Rundown, expectedDurationInMs: number, currentEpochTime: number): number {
    switch (rundown.timing.type) {
      case RundownTimingType.BACKWARD:
        return rundown.timing.expectedEndEpochTime
      case RundownTimingType.FORWARD:
        return rundown.timing.expectedEndEpochTime ?? rundown.timing.expectedStartEpochTime + expectedDurationInMs
      default:
        // TODO: We should set on the rundown when it is activated, in order to show correct start time for unscheduled rundowns.
        return currentEpochTime + expectedDurationInMs
    }
  }

  public getPlayedDurationInMsForOnAirPart(rundown: Rundown): number {
    const onAirSegment: Segment | undefined = rundown.segments.find(segment => segment.isOnAir)
    if (!onAirSegment || onAirSegment.isUntimed) {
      return 0
    }
    const onAirPart: Part | undefined = onAirSegment.parts.find(part => part.isOnAir)
    if (!onAirPart || onAirPart.isUntimed) {
      return 0
    }
    return this.partEntityService.getPlayedDuration(onAirPart)
  }

  public getPlayedDurationInMsForOnAirSegment(rundown: Rundown): number {
    const onAirSegment: Segment | undefined = rundown.segments.find(segment => segment.isOnAir)
    if (!onAirSegment) {
      return 0
    }
    const onAirPartIndex: number = onAirSegment.parts.findIndex(part => part.isOnAir)
    if (onAirPartIndex < 0) {
      return 0
    }
    const onAirPart: Part = onAirSegment.parts[onAirPartIndex]
    // TODO: Use currentEpochTime for getPlayedDuration instead of Date.now inside PartEntityService.getPlayedDuration
    const playedDurationInMsForOnAirPart: number = this.partEntityService.getPlayedDuration(onAirPart)
    const playedDurationInMsForPastPartsInSegment: number = onAirSegment.parts
      .slice(0, onAirPartIndex)
      .reduce((sumOfPartDurationsInMs, part) => sumOfPartDurationsInMs + this.partEntityService.getDuration(part), 0)
    return playedDurationInMsForPastPartsInSegment + playedDurationInMsForOnAirPart
  }

  public getDurationInMsSpentInOnAirSegment(rundown: Rundown, currentEpochTime: number): number {
    const onAirSegment: Segment | undefined = rundown.segments.find(segment => segment.isOnAir)
    if (!onAirSegment?.executedAtEpochTime) {
      return 0
    }
    return currentEpochTime - onAirSegment.executedAtEpochTime
  }

  public getRemainingDurationInMsForRundown(rundown: Rundown, expectedDurationsInMsForSegments: Record<string, number>, playedDurationInMsForOnAirSegment: number): number {
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
