import { Observable } from 'rxjs'
import { ActionTrigger } from '../models/action'

export abstract class ActionTriggerService {
    public abstract getActionTriggers(): Observable<ActionTrigger[]>
}
