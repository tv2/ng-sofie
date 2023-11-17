// TODO: describe what each attribute does
export interface RundownTimingContext {
  onAirSegmentId?: string
  currentEpochTime: number
  expectedDurationInMsForRundown: number
  expectedStartEpochTimeForRundown: number
  expectedEndEpochTimeForRundown: number
  remainingDurationInMsForRundown: number
  playedDurationInMsForOnAirPart: number
  playedDurationInMsForOnAirSegment: number
  durationInMsSpentInOnAirSegment: number
  expectedDurationsInMsForSegments: Record<string, number>
  startOffsetsInMsFromNextCursorForSegments: Record<string, number>
}
