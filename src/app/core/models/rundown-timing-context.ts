export interface RundownTimingContext {
  readonly onAirSegmentId?: string
  readonly currentEpochTime: number
  readonly expectedDurationInMsForRundown: number
  readonly expectedStartEpochTimeForRundown: number
  readonly expectedEndEpochTimeForRundown: number
  readonly remainingDurationInMsForRundown: number
  readonly playedDurationInMsForOnAirPart: number
  readonly playedDurationInMsForOnAirSegment: number
  readonly durationInMsSpentInOnAirSegment: number
  readonly expectedDurationsInMsForSegments: Readonly<Record<string, number>>
  readonly startOffsetsInMsFromNextCursorForSegments: Readonly<Record<string, number>>
}
