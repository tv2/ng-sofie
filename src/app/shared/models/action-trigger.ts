import { KeyAlias } from 'src/app/keyboard/value-objects/key-alias'
import { Tv2PartAction } from './tv2-action'
import { Keys } from 'src/app/keyboard/value-objects/key-binding'

export interface ActionTrigger<Data = unknown> {
  id: string
  actionId: string
  data: Data
}

export interface ActionTriggerWithActionInfo<Data = unknown> {
  id: string
  actionId: string
  data: Data
  actionInfo: Tv2PartAction
}

export interface KeyboardTriggerData {
  keys: Keys
  actionArguments?: unknown
  label: string
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
  DISABLE_SELECTION = 'DISABLE_SELECTION',
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
