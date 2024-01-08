import { KeyAlias } from 'src/app/keyboard/value-objects/key-alias'

export interface ActionTrigger<Data = unknown> {
  id: string
  actionId: string
  data: Data
}

export interface KeyboardTriggerData {
  keys: string[]
  actionArguments?: unknown
}

export interface KeyboardAndSelectionTriggerData extends KeyboardTriggerData {
  selected?: boolean
}

export interface CreateActionTrigger<Data = unknown> {
  actionId: string
  data: Data
}

export enum ActionTriggerSortKeys {
  ACTION_ID_A_Z = 'ACTION_ID_A_Z',
  ACTION_ID_Z_A = 'ACTION_ID_Z_A',
  SHORTCUT_A_Z = 'SHORTCUT_A_Z',
  SHORTCUT_Z_A = 'SHORTCUT_Z_A',
}

export enum UserActionsWithSelectedTriggers {
  TOGGLE_SELECT = 'TOGGLE_SELECT',
  EXPORT = 'EXPORT',
  DELETE = 'DELETE',
}

export const SHORTCUT_KEYS_MAPPINGS: Record<string, string> = {
  Enter: KeyAlias.ANY_ENTER,
  NumpadEnter: KeyAlias.ANY_ENTER,
  ShiftLeft: KeyAlias.SHIFT,
  ShiftRight: KeyAlias.SHIFT,
  ControlLeft: KeyAlias.CONTROL,
  ControlRight: KeyAlias.CONTROL,
}
