// TODO: describe what each attribute does
export interface RundownTimingContext {
  currentEpochTime: number
  expectedDurationInMs: number
  expectedStartEpochTime: number
  expectedEndEpochTime: number
  remainingDurationInMs: number
  onAirPartTimerDurationInMs: number // Should this be played duration instead?
  playedDurationInMsForOnAirSegment: number // Should this be played duration instead?
  durationInMsSpentInOnAirSegment: number
  expectedDurationsInMsForSegments: Record<string, number>
  startOffsetsInMsFromNextCursorForSegments: Record<string, number>
}
