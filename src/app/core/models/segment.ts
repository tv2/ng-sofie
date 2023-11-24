import { Part } from './part'

export interface Segment {
  readonly id: string
  readonly rundownId: string
  readonly name: string
  readonly isOnAir: boolean
  readonly isNext: boolean
  readonly isUntimed: boolean
  readonly parts: Part[]
  readonly expectedDurationInMs?: number
  readonly executedAtEpochTime?: number
}
