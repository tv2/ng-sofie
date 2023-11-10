import { Injectable } from '@angular/core'
import { ActionTriggerService } from '../abstractions/action-trigger.service'
import { catchError, Observable } from 'rxjs'
import { ActionTrigger } from '../models/action'
import { HttpClient } from '@angular/common/http'
import { HttpErrorService } from '../../core/services/http-error.service'
import { environment } from '../../../environments/environment'

@Injectable()
export class HttpActionTriggerService extends ActionTriggerService {
  constructor(
    private readonly http: HttpClient,
    private readonly httpErrorService: HttpErrorService
  ) {
    super()
  }

  public getActionTriggers(): Observable<ActionTrigger[]> {
    const url: string = `${environment.apiBaseUrl}/actions/triggers`
    return this.http.get<ActionTrigger[]>(url).pipe(catchError(error => this.httpErrorService.catchError(error)))
  }
}
