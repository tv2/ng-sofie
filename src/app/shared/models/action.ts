import { ActionType, PartActionType, PieceActionType } from './action-type'

export interface Action {
  id: string
  type: ActionType
  name: string
  description?: string
  argument?: ActionArgument
  metadata?: unknown
}

export interface ActionArgument {
  description: string
  name: string
  type: ActionArgumentSchema
}

export enum ActionArgumentSchema {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
}

export interface PieceAction extends Action {
  type: PieceActionType
}

export interface PartAction extends Action {
  type: PartActionType
}
