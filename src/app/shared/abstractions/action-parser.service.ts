import { Action } from '../models/action'

export abstract class ActionParser {
  public abstract parseAction(action: unknown): Action
  public abstract parseActions(actions: unknown): Action[]
}
