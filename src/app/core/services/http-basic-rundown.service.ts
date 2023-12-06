import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { HttpErrorService } from './http-error.service'
import { catchError, map, Observable } from 'rxjs'
import { BasicRundownService } from '../abstractions/basic-rundown.service'
import { BasicRundown } from '../models/basic-rundown'
import { EntityParser } from '../abstractions/entity-parser.service'
import { environment } from '../../../environments/environment'
import { ResponseParser } from '../abstractions/response-parser.service'

@Injectable()
export class HttpBasicRundownService implements BasicRundownService {
  constructor(
    private readonly http: HttpClient,
    private readonly httpErrorService: HttpErrorService,
    private readonly entityParser: EntityParser,
    private readonly responseParser: ResponseParser
  ) {}

  public fetchBasicRundowns(): Observable<BasicRundown[]> {
    return this.http.get<unknown>(`${environment.apiBaseUrl}/rundowns/basic`).pipe(
      map(this.responseParser.parseResponse.bind(this.responseParser)),
      map(this.assertType.bind(this)),
      catchError(error => this.httpErrorService.catchError(error)),
      // We know that this request to the backend returns a response with 'basicRundowns' set, if all goes well.
      map(data => this.entityParser.parseBasicRundowns(data.basicRundowns)) // TODO: Catch this and display/log it
    )
  }

  private assertType(data: unknown): { basicRundowns: unknown } {
    if (data && typeof data === 'object' && 'basicRundowns' in data) {
      return data as { basicRundowns: unknown }
    }
    // TODO: do we use 'HttpBasicRundownService.prototype.fetchBasicRundowns.name' in frontend outside tests?
    throw new Error("Response data for fetchBasicRundowns doesn't match expected type")
  }
}
