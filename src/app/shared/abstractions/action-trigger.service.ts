import { Observable } from 'rxjs'
import { ActionTrigger } from '../models/action-trigger'
import { KeyboardTriggerData } from '../models/keyboard-trigger-data'

export abstract class ActionTriggerService {
  public abstract getActionTriggers(): Observable<ActionTrigger<KeyboardTriggerData>[]>
  public abstract createActionTrigger(actionTrigger: ActionTrigger<KeyboardTriggerData>): Observable<void>
  public abstract updateActionTrigger(actionTrigger: ActionTrigger<KeyboardTriggerData>): Observable<void>
  public abstract deleteActionTrigger(actionTriggerId: string): Observable<void>
}
