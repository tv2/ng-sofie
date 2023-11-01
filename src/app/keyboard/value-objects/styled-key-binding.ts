import { KeyBinding, Keys } from './key-binding'

export interface StyledKeyBinding extends KeyBinding {
  readonly background?: string
  readonly mappedKeys?: Keys
}
