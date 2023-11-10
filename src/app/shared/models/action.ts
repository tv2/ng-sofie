import { ActionType, PartActionType, PieceActionType } from './action-type'
import { Keys } from '../../keyboard/value-objects/key-binding'

export interface Action {
  id: string
  type: ActionType
  name: string
  description?: string
  metadata?: unknown
}

export interface PieceAction extends Action {
  type: PieceActionType
}

export interface PartAction extends Action {
  type: PartActionType
}

export interface ActionTrigger {
  id: string
  actionId: string
  triggerData: {
    keys: Keys
  }
}
