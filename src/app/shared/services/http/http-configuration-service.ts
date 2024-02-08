import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { HttpErrorService } from './http-error.service'
import { environment } from '../../../../environments/environment'
import { catchError, map, Observable } from 'rxjs'
import { HttpResponse } from './http-response'
import { ConfigurationService } from '../configuration.service'
import { StudioConfiguration } from '../../models/studio-configuration'
import { Shelf } from '../../models/shelf'
import { ConfigurationParser } from '../../abstractions/configuration-parser.service'

@Injectable()
export class HttpConfigurationService implements ConfigurationService {
  constructor(
    private readonly http: HttpClient,
    private readonly httpErrorService: HttpErrorService,
    private readonly configurationParser: ConfigurationParser
  ) {}

  public getStudioConfiguration(): Observable<StudioConfiguration> {
    return this.http.get<HttpResponse<StudioConfiguration>>(`${environment.apiBaseUrl}/configurations/studio`).pipe(
      catchError(error => this.httpErrorService.catchError(error)),
      map(response => this.configurationParser.parseStudioConfiguration(response.data))
    )
  }

  public getShelfConfiguration(): Observable<Shelf> {
    return this.http.get<HttpResponse<Shelf[]>>(`${environment.apiBaseUrl}/configurations/shelves`).pipe(
      catchError(error => this.httpErrorService.catchError(error)),
      map(response => this.configurationParser.parseShelf(response.data[0]))
    )
  }
}
