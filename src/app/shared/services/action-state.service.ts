import { ActionService } from '../abstractions/action.service'
import { Action } from '../models/action'
import { Observable, Subject } from 'rxjs'

export class ActionStateService {
  private actions: Action[] = []
  private readonly actionsSubject: Subject<Action[]>

  constructor(private readonly actionService: ActionService) {
    this.actionsSubject.next(this.actions)
    this.actionService.getActions().subscribe(actions => {
      this.actions = actions
    })
  }

  public subscribeToActions(): Observable<Action[]> {
    return this.actionsSubject.asObservable()
  }
}
