import { Tv2PartAction } from './tv2-action'

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
