import { Injectable } from '@angular/core'
import { catchError, map, Observable } from 'rxjs'
import { ActionTriggerService } from '../../abstractions/action-trigger.service'
import { ActionTrigger, CreateActionTrigger, KeyboardTriggerData } from '../../models/action-trigger'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../environments/environment'
import { ActionTriggerValidator } from '../../abstractions/action-trigger-parser.service'
import { HttpErrorService } from './http-error.service'
import { HttpResponse } from './http-response'

const ACTION_TRIGGER_URL: string = `${environment.apiBaseUrl}/actionTriggers`

@Injectable()
export class HttpActionTriggerService extends ActionTriggerService {
  constructor(
    private readonly http: HttpClient,
    private readonly httpErrorService: HttpErrorService,
    private readonly actionTriggerParser: ActionTriggerValidator
  ) {
    super()
  }

  public getActionTriggers(): Observable<ActionTrigger<KeyboardTriggerData>[]> {
    return this.http.get<HttpResponse<ActionTrigger<KeyboardTriggerData>[]>>(`${environment.apiBaseUrl}/actionTriggers`).pipe(
      catchError(error => this.httpErrorService.catchError(error)),
      map(response => this.actionTriggerParser.parseActionTriggers(response.data))
    )
  }

  public createActionTrigger(actionTrigger: CreateActionTrigger<KeyboardTriggerData>): Observable<void> {
    return this.http.post<void>(`${ACTION_TRIGGER_URL}`, actionTrigger)
  }

  public updateActionTrigger(actionTrigger: ActionTrigger<KeyboardTriggerData>): Observable<void> {
    return this.http.put<void>(`${ACTION_TRIGGER_URL}`, actionTrigger)
  }

  public deleteActionTrigger(actionTriggerId: string): Observable<void> {
    return this.http.delete<void>(`${ACTION_TRIGGER_URL}/${actionTriggerId}`)
  }
}
