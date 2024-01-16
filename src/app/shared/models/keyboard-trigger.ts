import { KeyAlias } from 'src/app/keyboard/value-objects/key-alias'
import { Keys } from 'src/app/keyboard/value-objects/key-binding'
import { KeyEventType } from 'src/app/keyboard/value-objects/key-event-type'

export interface KeyboardTriggerData {
  keys: Keys
  actionArguments?: string | number
  label: string
  triggerOn: KeyEventType
  mappedToKeys?: Keys
}

export enum ActionTriggerSortKeys {
  ACTION = 'ACTION',
  SHORTCUT = 'SHORTCUT',
}

export const SHORTCUT_KEYS_MAPPINGS: Record<string, string> = {
  Enter: KeyAlias.ANY_ENTER,
  NumpadEnter: KeyAlias.ANY_ENTER,
  ShiftLeft: KeyAlias.SHIFT,
  ShiftRight: KeyAlias.SHIFT,
  ControlLeft: KeyAlias.CONTROL,
  ControlRight: KeyAlias.CONTROL,
}
