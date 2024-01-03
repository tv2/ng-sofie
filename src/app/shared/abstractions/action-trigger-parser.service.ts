import { ActionTrigger, KeyboardTriggerData } from '../models/action-trigger'

// TODO: This is technically just a validator and should be named as such, but we would need to agree to change the convention to that
export abstract class ActionTriggerValidator {
  public abstract parseActionTriggers(actionTriggers: ActionTrigger<KeyboardTriggerData>[]): ActionTrigger<KeyboardTriggerData>[]
}
