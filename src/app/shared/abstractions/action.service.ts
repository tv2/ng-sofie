import { Observable } from 'rxjs'
import { Action } from '../models/action'

export abstract class ActionService {
  public abstract getActions(rundownId: string): Observable<Action[]>
  public abstract executeAction(actionId: string, rundownId: string): Observable<void>
}
