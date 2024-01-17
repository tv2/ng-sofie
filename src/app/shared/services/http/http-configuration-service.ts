import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { HttpErrorService } from './http-error.service'
import { environment } from '../../../../environments/environment'
import { catchError, map, Observable } from 'rxjs'
import { HttpResponse } from './http-response'
import { EntityParser } from '../../../core/abstractions/entity-parser.service'
import { Configuration } from '../../../core/models/configuration'
import { ConfigurationService } from '../configuration-service'

@Injectable({
  providedIn: 'root',
})
export class HttpConfigurationService implements ConfigurationService {
  constructor(
    private readonly http: HttpClient,
    private readonly httpErrorService: HttpErrorService,
    private readonly entityParser: EntityParser
  ) {}

  public getStudioConfiguration(): Observable<Configuration> {
    return this.http.get<HttpResponse<Configuration>>(`${environment.apiBaseUrl}/configurations/studio`).pipe(
      catchError(error => this.httpErrorService.catchError(error)),
      map(response => this.entityParser.parseStudioConfiguration(response))
    )
  }
}
