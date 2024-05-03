import { ActionType, PartActionType, PieceActionType, PlaceholderActionType } from './action-type'

export interface Action {
  id: string
  type: ActionType
  name: string
  rank: number
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

export interface PlaceholderAction extends Action {
  type: PlaceholderActionType
}
