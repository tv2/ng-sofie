import { ActionTrigger } from '../models/action-trigger'

// TODO: This is technically just a validator and should be named as such, but we would need to agree to change the convention to that
export abstract class ActionTriggerParser {
  public abstract parseActionTrigger(actionTrigger: ActionTrigger): ActionTrigger
  public abstract parseActionTriggers(actionTriggers: ActionTrigger[]): ActionTrigger[]
}
