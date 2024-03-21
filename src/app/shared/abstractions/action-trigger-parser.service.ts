import { ActionTrigger } from '../models/action-trigger'
import { KeyboardTriggerData } from '../models/keyboard-trigger-data'

export abstract class ActionTriggerParser {
  public abstract parseActionTriggerData(data: unknown): KeyboardTriggerData
  public abstract parseActionTriggers(actionTriggers: unknown): ActionTrigger<KeyboardTriggerData>[]
  public abstract parseActionTrigger(actionTrigger: unknown): ActionTrigger<KeyboardTriggerData>
}
