import { ActionService } from '../abstractions/action.service'
import { catchError, map, Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { HttpErrorService } from '../../core/services/http-error.service'
import { Injectable } from '@angular/core'

@Injectable()
export class HttpActionService implements ActionService {
  constructor(
    private readonly http: HttpClient,
    private readonly httpErrorService: HttpErrorService
  ) {}

  public executeAction(actionId: string, rundownId: string): Observable<void> {
    const url: string = this.getExecuteActionUrl(actionId, rundownId)
    return this.http.put(url, null).pipe(
      catchError(error => this.httpErrorService.catchError(error)),
      map(() => undefined)
    )
  }

  private getExecuteActionUrl(actionId: string, rundownId: string): string {
    return `${environment.apiBaseUrl}/actions/${actionId}/rundowns/${rundownId}`
  }
}
