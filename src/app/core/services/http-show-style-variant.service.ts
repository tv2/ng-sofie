import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { catchError, map, Observable } from 'rxjs'
import { HttpErrorService } from './http-error.service'
import { EntityParser } from '../abstractions/entity-parser.service'
import { ShowStyleVariantService } from '../abstractions/show-style-variant.service'
import { ShowStyleVariant } from '../models/show-style-variant'
import { environment } from '../../../environments/environment'
import { ResponseParser } from '../abstractions/response-parser.service'

const CONFIGURATION_URL: string = `${environment.apiBaseUrl}/configurations`

@Injectable()
export class HttpShowStyleVariantService implements ShowStyleVariantService {
  constructor(
    private readonly http: HttpClient,
    private readonly httpErrorService: HttpErrorService,
    private readonly entityParser: EntityParser,
    private readonly responseParser: ResponseParser
  ) {}

  public getShowStyleVariant(rundownId: string): Observable<ShowStyleVariant> {
    return this.http.get<unknown>(`${CONFIGURATION_URL}/rundowns/${rundownId}`).pipe(
      map(this.responseParser.parseResponse.bind(this.responseParser)),
      map(this.assertType.bind(this)),
      catchError(error => this.httpErrorService.catchError(error)),
      map(data => this.entityParser.parseShowStyleVariant(data.showStyleVariant))
    )
  }

  private assertType(data: unknown): { showStyleVariant: unknown } {
    if (data && typeof data === 'object' && 'showStyleVariant' in data) {
      return data as { showStyleVariant: unknown }
    }
    // TODO: do we use 'HttpShowStyleVariantService.prototype.getShowStyleVariant.name' in frontend outside tests?
    throw new Error("Response data for getShowStyleVariant doesn't match expected type")
  }
}
