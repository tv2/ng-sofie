import { Part } from './part'
import { MiniShelfMetadata } from '../../rundown-view/components/minishelf/mini-shelf.component'

export interface Segment {
  readonly miniShelMetadata?: MiniShelfMetadata
  readonly id: string
  readonly rundownId: string
  readonly name: string
  readonly isOnAir: boolean
  readonly isNext: boolean
  readonly isUntimed: boolean
  readonly isUnsynced: boolean
  readonly parts: Part[]
  readonly rank: number
  readonly expectedDurationInMs?: number
  readonly executedAtEpochTime?: number
}
