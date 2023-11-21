import { RundownTiming } from './rundown-timing'

export interface BasicRundown {
  readonly id: string
  readonly name: string
  readonly isActive: boolean
  readonly modifiedAt: number
  readonly timing: RundownTiming
}
