import { ActionType, PartActionType, PieceActionType } from './action-type'

export interface Action {
  id: string
  type: ActionType
  name: string
  description?: string
  argument?: ActionArgumentSchema
  metadata?: unknown
  rundownId?: string
}

export interface ActionArgumentSchema {
  description: string
  name: string
  type: ActionArgumentSchemaType
}

export enum ActionArgumentSchemaType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
}

export interface PieceAction extends Action {
  type: PieceActionType
}

export interface PartAction extends Action {
  type: PartActionType
}
