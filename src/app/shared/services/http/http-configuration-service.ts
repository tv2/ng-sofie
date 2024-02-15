import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { HttpErrorService } from './http-error.service'
import { environment } from '../../../../environments/environment'
import { catchError, map, Observable } from 'rxjs'
import { HttpResponse } from './http-response'
import { EntityParser } from '../../../core/abstractions/entity-parser.service'
import { ConfigurationService } from '../configuration.service'
import { StudioConfiguration } from '../../models/studio-configuration'

const CONFIGURATION_URL: string = `${environment.apiBaseUrl}/configurations`

@Injectable()
export class HttpConfigurationService implements ConfigurationService {
  constructor(
    private readonly http: HttpClient,
    private readonly httpErrorService: HttpErrorService,
    private readonly entityParser: EntityParser
  ) {}

  public getStudioConfiguration(): Observable<StudioConfiguration> {
    return this.http.get<HttpResponse<StudioConfiguration>>(`${CONFIGURATION_URL}/studio`).pipe(
      catchError(error => this.httpErrorService.catchError(error)),
      map(response => this.entityParser.parseStudioConfiguration(response.data))
    )
  }

  public clearConfigurationCache(): Observable<void> {
    return this.http.post<void>(`${CONFIGURATION_URL}/cache/clear`, null).pipe(catchError(error => this.httpErrorService.catchError(error)))
  }
}
