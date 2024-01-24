import { Tv2PartAction } from './tv2-action'

export interface ActionTrigger<Data = unknown> {
  id: string
  actionId: string
  data: Data
}

export interface ActionTriggerWithAction<ActionTriggerData = unknown> {
  actionTrigger: ActionTrigger<ActionTriggerData>
  action: Tv2PartAction
}
