import { SystemInformationService } from '../system-information.service'
import { Injectable } from '@angular/core'
import { catchError, map, Observable } from 'rxjs'
import { SystemInformation } from '../../models/system-information'
import { HttpClient } from '@angular/common/http'
import { HttpResponse } from './http-response'
import { environment } from '../../../../environments/environment'
import { HttpErrorService } from './http-error.service'
import { EntityParser } from '../../../core/abstractions/entity-parser.service'
import { StatusMessage } from '../../models/status-message'

@Injectable()
export class HttpSystemInformationService implements SystemInformationService {
  constructor(
    private readonly http: HttpClient,
    private readonly httpErrorService: HttpErrorService,
    private readonly entityParser: EntityParser
  ) {}

  public getSystemInformation(): Observable<SystemInformation> {
    return this.http.get<HttpResponse<SystemInformation>>(`${environment.apiBaseUrl}/systemInformation`).pipe(
      catchError(error => this.httpErrorService.catchError(error)),
      map(response => this.entityParser.parseSystemInformation(response.data))
    )
  }

  public getStatusMessages(): Observable<StatusMessage[]> {
    return this.http.get<HttpResponse<StatusMessage[]>>(`${environment.apiBaseUrl}/systemInformation/statusMessages`).pipe(
      catchError(error => this.httpErrorService.catchError(error)),
      map(response => this.entityParser.parseStatusMessages(response.data))
    )
  }
}
