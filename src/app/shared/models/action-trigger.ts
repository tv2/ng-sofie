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
  id?: string
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
