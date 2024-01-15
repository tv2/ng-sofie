import { ActionTrigger } from '../models/action-trigger'
import { KeyboardTriggerData } from '../models/keyboard-trigger'

// TODO: This is technically just a validator and should be named as such, but we would need to agree to change the convention to that
export abstract class ActionTriggerParser {
  public abstract parseActionTriggerData(data: unknown): KeyboardTriggerData
  public abstract parseActionTriggers(actionTriggers: ActionTrigger<KeyboardTriggerData>[]): ActionTrigger<KeyboardTriggerData>[]
}
