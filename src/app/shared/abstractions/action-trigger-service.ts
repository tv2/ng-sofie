import { Observable } from 'rxjs'
import { ActionTrigger } from '../models/action-trigger'

export abstract class ActionTriggerService {

    public abstract getActionTriggers(): Observable<ActionTrigger[]>
}
