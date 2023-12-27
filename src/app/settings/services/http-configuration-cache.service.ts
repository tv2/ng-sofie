import { Injectable } from '@angular/core'
import { catchError, Observable } from 'rxjs'
import { environment } from '../../../environments/environment'
import { HttpClient } from '@angular/common/http'
import { HttpErrorService } from '../../shared/services/http/http-error.service'

@Injectable()
export class HttpConfigurationCacheService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly httpErrorService: HttpErrorService
  ) {}

  public postClearConfigurationCache(): Observable<void> {
    return this.httpClient.post<void>(`${environment.apiBaseUrl}/configurations/reset`, null).pipe(
      catchError(error => {
        return this.httpErrorService.catchError(error)
      })
    )
  }
}
