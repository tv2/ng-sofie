import { Observable } from 'rxjs'
import { ActionTrigger, EditActionsTriggers, KeyboardTriggerData } from '../models/action-trigger'

export abstract class ActionTriggerService {
  public abstract getActionTriggers(): Observable<ActionTrigger<KeyboardTriggerData>[]>
  public abstract createActionTrigger(actionTrigger: EditActionsTriggers): Observable<void>
  public abstract updateActionTrigger(actionTrigger: EditActionsTriggers): Observable<void>
  public abstract deleteActionTrigger(actionTriggerId: string): Observable<void>
}
