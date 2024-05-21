import { Part } from './part'
import { Tv2SegmentMetadata } from './tv2-segment-metadata'
import { Invalidity } from './invalidity'

export interface Segment {
  readonly id: string
  readonly rundownId: string
  readonly name: string
  readonly isOnAir: boolean
  readonly isNext: boolean
  readonly isUntimed: boolean
  readonly isUnsynced: boolean
  readonly parts: Readonly<Part[]>
  readonly rank: number
  readonly isHidden: boolean
  readonly referenceTag?: string
  readonly expectedDurationInMs?: number
  readonly executedAtEpochTime?: number
  readonly metadata?: Tv2SegmentMetadata
  readonly invalidity?: Invalidity
}
