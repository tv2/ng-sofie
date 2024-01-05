import { Action } from '../models/action'

export abstract class ActionValidator {
  public abstract validateAction(action: unknown): Action
  public abstract validateActions(actions: unknown): Action[]
}
