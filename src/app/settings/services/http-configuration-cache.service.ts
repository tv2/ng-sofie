import { Injectable } from '@angular/core'
import { Logger } from '../../core/abstractions/logger.service'
import { catchError, Observable } from 'rxjs'
import { environment } from '../../../environments/environment'
import { HttpClient } from '@angular/common/http'
import { HttpErrorService } from '../../shared/services/http/http-error.service'

@Injectable()
export class HttpConfigurationCacheService {
  private readonly logger: Logger
  private readonly httpClient: HttpClient
  private readonly httpErrorService: HttpErrorService
  constructor(logger: Logger, httpClient: HttpClient, httpErrorService: HttpErrorService) {
    this.logger = logger.tag('HttpConfigurationCacheService')
    this.httpClient = httpClient
    this.httpErrorService = httpErrorService
  }

  public postClearConfigurationCache(): Observable<void> {
    this.logger.info('postClearConfigurationCache')
    return this.httpClient.post<void>(`${environment.apiBaseUrl}/configurations/reset`, null).pipe(catchError(error => this.httpErrorService.catchError(error)))
  }
}
