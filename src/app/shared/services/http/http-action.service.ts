import { ActionService } from '../../abstractions/action.service'
import { catchError, map, Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../environments/environment'
import { HttpErrorService } from './http-error.service'
import { Injectable } from '@angular/core'
import { Action } from '../../models/action'
import { ActionParser } from '../../abstractions/action-parser.service'
import { HttpResponse } from './http-response'

@Injectable()
export class HttpActionService implements ActionService {
  constructor(
    private readonly http: HttpClient,
    private readonly httpErrorService: HttpErrorService,
    private readonly actionParser: ActionParser
  ) {}

  public getActionsByRundownId(rundownId: string): Observable<Action[]> {
    const url: string = this.getGetActionsUrlByRundownId(rundownId)
    return this.http.get<HttpResponse<Action[]>>(url).pipe(
      catchError(error => this.httpErrorService.catchError(error)),
      map(response => this.actionParser.parseActions(response.data))
    )
  }

  public getSystemActions(): Observable<Action[]> {
    const url: string = this.getGetSystemActionsUrl()
    return this.http.get<HttpResponse<Action[]>>(url).pipe(
      catchError(error => this.httpErrorService.catchError(error)),
      map(response => this.actionParser.parseActions(response.data))
    )
  }

  private getGetActionsUrlByRundownId(rundownId?: string): string {
    return `${environment.apiBaseUrl}/actions/rundowns/${rundownId}`
  }

  private getGetSystemActionsUrl(): string {
    return `${environment.apiBaseUrl}/actions`
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
