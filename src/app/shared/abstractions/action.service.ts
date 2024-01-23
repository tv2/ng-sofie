import { Observable } from 'rxjs'
import { Action } from '../models/action'

export abstract class ActionService {
  public abstract getActionsByRundownId(rundownId: string): Observable<Action[]>
  public abstract getSystemActions(): Observable<Action[]>
  public abstract executeAction(actionId: string, rundownId: string, actionArguments?: unknown): Observable<void>
}
