import { ActionService } from '../abstractions/action.service'
import { catchError, map, Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { HttpErrorService } from '../../core/services/http-error.service'
import { Injectable } from '@angular/core'
import { Action } from '../models/action'
import { ActionParser } from '../abstractions/action-parser.service'
import { ResponseParser } from '../../core/abstractions/response-parser.service'

@Injectable()
export class HttpActionService implements ActionService {
  constructor(
    private readonly http: HttpClient,
    private readonly httpErrorService: HttpErrorService,
    private readonly actionParser: ActionParser,
    private readonly responseParser: ResponseParser
  ) {}

  public getActions(rundownId: string): Observable<Action[]> {
    const url: string = this.getGetActionsUrl(rundownId)
    return this.http.get<unknown>(url).pipe(
      map(this.responseParser.parseResponse.bind(this.responseParser)),
      map(this.assertType.bind(this)),
      catchError(error => this.httpErrorService.catchError(error)),
      map(data => this.actionParser.parseActions(data.actions))
    )
  }

  private assertType(data: unknown): { actions: unknown } {
    if (data && typeof data === 'object' && 'actions' in data) {
      return data as { actions: unknown }
    }
    // TODO: do we use 'HttpActionService.prototype.getActions.name' in frontend outside tests?
    throw new Error("Response data for getActions doesn't match expected type")
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
