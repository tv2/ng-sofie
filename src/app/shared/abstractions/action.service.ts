import { Observable } from 'rxjs'
import { Action } from '../models/action'

export abstract class ActionService {
    public abstract getActions(): Observable<Action[]> // TODO: use correct type
    public abstract executeAction(actionId: string, rundownId: string): Observable<void>
}
