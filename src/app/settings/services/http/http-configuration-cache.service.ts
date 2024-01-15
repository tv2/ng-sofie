import { Injectable } from '@angular/core'
import { catchError, Observable } from 'rxjs'
import { environment } from '../../../../environments/environment'
import { HttpClient } from '@angular/common/http'
import { HttpErrorService } from '../../../shared/services/http/http-error.service'

@Injectable()
export class HttpConfigurationCacheService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly httpErrorService: HttpErrorService
  ) {}

  public clearConfigurationCache(): Observable<void> {
    return this.httpClient.post<void>(`${environment.apiBaseUrl}/configurations/cache/clear`, null).pipe(catchError(error => this.httpErrorService.catchError(error)))
  }
}
