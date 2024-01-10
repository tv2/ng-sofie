import { ActionType, PartActionType, PieceActionType } from './action-type'

export interface Action {
  id: string
  type: ActionType
  name: string
  description?: string
  argument?: Argument
  metadata?: unknown
}

export interface Argument {
  description: string
  name: string
  type: ArgumentType
}

export enum ArgumentType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
}

export interface PieceAction extends Action {
  type: PieceActionType
}

export interface PartAction extends Action {
  type: PartActionType
}
