import { RundownMode } from '../enums/rundown-mode'
import { RundownTiming } from './rundown-timing'

export interface BasicRundown {
  readonly id: string
  readonly name: string
  readonly mode: RundownMode
  readonly modifiedAt: number
  readonly timing: RundownTiming
}
