import { Part } from './part'
import { Metadata } from './metadata'

export interface Segment {
  readonly executedAtEpochTime?: number
  readonly expectedDurationInMs?: number
  readonly id: string
  readonly isHidden: boolean
  readonly isNext: boolean
  readonly isOnAir: boolean
  readonly isUnsynced: boolean
  readonly isUntimed: boolean
  readonly metadata?: Metadata
  readonly name: string
  readonly parts: Part[]
  readonly rank: number
  readonly rundownId: string
}
