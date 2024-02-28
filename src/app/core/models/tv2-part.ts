import { Part } from './part'

export interface Tv2Part extends Part {
  readonly metadata?: Tv2PartMetadata
}

export interface Tv2PartMetadata {
  readonly actionId?: string // If the Part was created from an Action, this is the id of said Action.
}
