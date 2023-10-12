import { ActionService } from '../abstractions/action.service'
import { catchError, map, Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { HttpErrorService } from '../../core/services/http-error.service'
import { Injectable } from '@angular/core'
import { Action } from '../models/action'

@Injectable()
export class HttpActionService implements ActionService {
  constructor(
    private readonly http: HttpClient,
    private readonly httpErrorService: HttpErrorService
  ) {}

  public getActions(rundownId: string): Observable<Action[]> {
    const url: string = this.getGetActionsUrl(rundownId)
    return this.http.get<unknown>(url).pipe(
      catchError(error => this.httpErrorService.catchError(error)),
      map(actions => actions as unknown as Action[]) // TODO: use parser
    )
  }

  private getGetActionsUrl(rundownId: string): string {
    return `${environment.apiBaseUrl}/actions/rundowns/${rundownId}`
  }

  public executeAction(actionId: string, rundownId: string): Observable<void> {
    const url: string = this.getExecuteActionUrl(actionId, rundownId)
    return this.http.put(url, { actionId, rundownId }).pipe(
      catchError(error => this.httpErrorService.catchError(error)),
      map(() => undefined)
    )
  }

  private getExecuteActionUrl(actionId: string, rundownId: string): string {
    return `${environment.apiBaseUrl}/actions/${actionId}/rundowns/${rundownId}`
  }
}
