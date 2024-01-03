import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { catchError, map, Observable } from 'rxjs'
import { HttpErrorService } from '../../../shared/services/http/http-error.service'
import { EntityValidator } from '../../abstractions/entity-parser.service'
import { ShowStyleVariantService } from '../../abstractions/show-style-variant.service'
import { ShowStyleVariant } from '../../models/show-style-variant'
import { environment } from '../../../../environments/environment'
import { HttpResponse } from '../../../shared/services/http/http-response'

const CONFIGURATION_URL: string = `${environment.apiBaseUrl}/configurations`

@Injectable()
export class HttpShowStyleVariantService implements ShowStyleVariantService {
  constructor(
    private readonly http: HttpClient,
    private readonly httpErrorService: HttpErrorService,
    private readonly entityParser: EntityValidator
  ) {}

  public getShowStyleVariant(rundownId: string): Observable<ShowStyleVariant> {
    return this.http.get<HttpResponse<ShowStyleVariant>>(`${CONFIGURATION_URL}/rundowns/${rundownId}`).pipe(
      catchError(error => this.httpErrorService.catchError(error)),
      map(response => this.entityParser.validateShowStyleVariant(response.data))
    )
  }
}
