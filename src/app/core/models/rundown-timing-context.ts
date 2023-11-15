// TODO: describe what each attribute does
export interface RundownTimingContext {
  expectedDurationInMs: number
  expectedStartEpochTime: number
  expectedEndEpochTime: number
  remainingDurationInMs: number
  onAirPartTimerDurationInMs: number
  onAirSegmentTimerDurationInMs: number
  durationInMsSpentInOnAirSegment: number
  expectedDurationsInMsForSegments: Record<string, number>
  startOffsetsInMsFromNextCursorForSegments: Record<string, number>
}
