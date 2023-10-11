import { ActionType } from './action-type'

export interface Action {
  id: string
  type: ActionType
  name: string
  description?: string
  metadata: unknown
}
