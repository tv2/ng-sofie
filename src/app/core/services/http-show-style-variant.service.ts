import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { catchError, map, Observable } from 'rxjs'
import { HttpErrorService } from './http-error.service'
import { EntityParser } from '../abstractions/entity-parser.service'
import { ShowStyleVariantService } from '../abstractions/show-style-variant.service'
import { ShowStyleVariant } from '../models/show-style-variant'

const CONFIGURATION_URL: string = 'http://localhost:3005/api/configurations'

@Injectable()
export class HttpShowStyleVariantService implements ShowStyleVariantService {
  constructor(
    private readonly http: HttpClient,
    private readonly httpErrorService: HttpErrorService,
    private readonly entityParser: EntityParser
  ) {}

  public getShowStyleVariant(rundownId: string): Observable<ShowStyleVariant> {
    return this.http.get<unknown>(`${CONFIGURATION_URL}/rundowns/${rundownId}`).pipe(
      catchError(error => this.httpErrorService.catchError(error)),
      map(this.entityParser.parseShowStyleVariant.bind(this.entityParser))
    )
  }
}
