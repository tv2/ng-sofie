import { ActionService } from '../abstractions/action.service'
import { catchError, map, Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { HttpErrorService } from '../../core/services/http-error.service'
import { Injectable } from '@angular/core'
import { Action } from '../models/action'
import { ActionParser } from '../abstractions/action-parser.service'

@Injectable()
export class HttpActionService implements ActionService {
  constructor(
    private readonly http: HttpClient,
    private readonly httpErrorService: HttpErrorService,
    private readonly actionParser: ActionParser
  ) {}

  public getActions(rundownId: string): Observable<Action[]> {
    const url: string = this.getGetActionsUrl(rundownId)
    return this.http.get<unknown>(url).pipe(
      catchError(error => this.httpErrorService.catchError(error)),
      map(actions => this.actionParser.parseActions(actions))
    )
  }

  private getGetActionsUrl(rundownId: string): string {
    return `${environment.apiBaseUrl}/actions/rundowns/${rundownId}`
  }

  public executeAction(actionId: string, rundownId: string, actionArguments?: unknown): Observable<void> {
    const url: string = this.getExecuteActionUrl(actionId, rundownId)
    return this.http.put(url, { actionArguments }).pipe(
      catchError(error => this.httpErrorService.catchError(error)),
      map(() => undefined)
    )
  }

  private getExecuteActionUrl(actionId: string, rundownId: string): string {
    return `${environment.apiBaseUrl}/actions/${actionId}/rundowns/${rundownId}`
  }
}
