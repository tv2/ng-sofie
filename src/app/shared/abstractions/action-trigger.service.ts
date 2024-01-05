import { Observable } from 'rxjs'
import { ActionTrigger, CreateActionTrigger, KeyboardTriggerData } from '../models/action-trigger'

export abstract class ActionTriggerService {
  public abstract getActionTriggers(): Observable<ActionTrigger<KeyboardTriggerData>[]>
  public abstract createActionTrigger(actionTrigger: CreateActionTrigger<KeyboardTriggerData>): Observable<void>
  public abstract updateActionTrigger(actionTrigger: ActionTrigger<KeyboardTriggerData>): Observable<void>
  public abstract deleteActionTrigger(actionTriggerId: string): Observable<void>
}
