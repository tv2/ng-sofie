import { Part } from './part'
import { SegmentMetadata } from './segmentMetadata'

export interface Segment {
  readonly id: string
  readonly rundownId: string
  readonly name: string
  readonly isOnAir: boolean
  readonly isNext: boolean
  readonly isUntimed: boolean
  readonly isUnsynced: boolean
  readonly parts: Part[]
  readonly rank: number
  readonly isHidden: boolean
  readonly expectedDurationInMs?: number
  readonly executedAtEpochTime?: number
  readonly metadata?: SegmentMetadata
}
