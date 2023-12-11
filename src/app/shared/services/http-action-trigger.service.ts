import { Injectable } from '@angular/core'
import { catchError, Observable } from 'rxjs'
import { ActionTriggerService } from '../abstractions/action-trigger-service'
import { ActionTrigger } from '../models/action-trigger'
import { HttpClient } from '@angular/common/http'
import { HttpErrorService } from '../../core/services/http-error.service'
import { environment } from '../../../environments/environment'

const ACTION_TRIGGER_URL: string = `${environment.apiBaseUrl}/actionTriggers`

@Injectable()
export class HttpActionTriggerService extends ActionTriggerService {
  constructor(
    private readonly http: HttpClient,
    private readonly httpErrorService: HttpErrorService
  ) {
    super()
  }

  public getActionTriggers(): Observable<ActionTrigger[]> {
    return this.http.get<ActionTrigger[]>(ACTION_TRIGGER_URL).pipe(catchError(error => this.httpErrorService.catchError(error)))
  }
}
