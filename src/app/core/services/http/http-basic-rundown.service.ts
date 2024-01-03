import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { HttpErrorService } from '../../../shared/services/http/http-error.service'
import { catchError, map, Observable } from 'rxjs'
import { BasicRundownService } from '../../abstractions/basic-rundown.service'
import { BasicRundown } from '../../models/basic-rundown'
import { EntityValidator } from '../../abstractions/entity-parser.service'
import { environment } from '../../../../environments/environment'
import { HttpResponse } from '../../../shared/services/http/http-response'

@Injectable()
export class HttpBasicRundownService implements BasicRundownService {
  constructor(
    private readonly http: HttpClient,
    private readonly httpErrorService: HttpErrorService,
    private readonly entityParser: EntityValidator
  ) {}

  public fetchBasicRundowns(): Observable<BasicRundown[]> {
    return this.http.get<HttpResponse<BasicRundown[]>>(`${environment.apiBaseUrl}/rundowns/basic`).pipe(
      catchError(error => this.httpErrorService.catchError(error)),
      map(response => this.entityParser.validateBasicRundowns(response.data)) // TODO: Catch this and display/log it
    )
  }
}
