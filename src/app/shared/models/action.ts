import { ActionType, PartActionType, PieceActionType } from './action-type'

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
