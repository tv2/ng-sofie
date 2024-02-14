import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { HttpErrorService } from './http-error.service'
import { environment } from '../../../../environments/environment'
import { catchError, map, Observable } from 'rxjs'
import { HttpResponse } from './http-response'
import { ConfigurationService } from '../configuration.service'
import { StudioConfiguration } from '../../models/studio-configuration'
import { ShelfConfiguration } from '../../models/shelf-configuration'
import { ConfigurationParser } from '../../abstractions/configuration-parser.service'

const CONFIGURATION_URL: string = `${environment.apiBaseUrl}/configurations`

@Injectable()
export class HttpConfigurationService implements ConfigurationService {
  constructor(
    private readonly http: HttpClient,
    private readonly httpErrorService: HttpErrorService,
    private readonly configurationParser: ConfigurationParser
  ) {}

  public getStudioConfiguration(): Observable<StudioConfiguration> {
    return this.http.get<HttpResponse<StudioConfiguration>>(`${CONFIGURATION_URL}/studio`).pipe(
      catchError(error => this.httpErrorService.catchError(error)),
      map(response => this.configurationParser.parseStudioConfiguration(response.data))
    )
  }

  public getShelfConfiguration(): Observable<ShelfConfiguration> {
    return this.http.get<HttpResponse<ShelfConfiguration[]>>(`${environment.apiBaseUrl}/configurations/shelfConfigurations`).pipe(
      catchError(error => this.httpErrorService.catchError(error)),
      map(response => this.configurationParser.parseShelfConfiguration(response.data[0]))
    )
  }

  public clearConfigurationCache(): Observable<void> {
    return this.http.post<void>(`${CONFIGURATION_URL}/cache/clear`, null).pipe(catchError(error => this.httpErrorService.catchError(error)))
  }
}
