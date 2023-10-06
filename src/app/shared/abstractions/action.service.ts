import { Observable } from 'rxjs'

export abstract class ActionService {
  public abstract executeAction(actionId: string, rundownId: string): Observable<void>
}
