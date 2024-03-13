import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { catchError, map, Observable } from 'rxjs'
import { RundownService } from '../../abstractions/rundown.service'
import { HttpErrorService } from '../../../shared/services/http/http-error.service'
import { Rundown } from '../../models/rundown'
import { EntityParser } from '../../abstractions/entity-parser.service'
import { environment } from '../../../../environments/environment'
import { HttpResponse } from '../../../shared/services/http/http-response'

const RUNDOWN_URL: string = `${environment.apiBaseUrl}/rundowns`

@Injectable()
export class HttpRundownService implements RundownService {
  constructor(
    private readonly http: HttpClient,
    private readonly httpErrorService: HttpErrorService,
    private readonly entityParser: EntityParser
  ) {}

  public fetchRundown(rundownId: string): Observable<Rundown> {
    return this.http.get<HttpResponse<Rundown>>(`${RUNDOWN_URL}/${rundownId}`).pipe(
      catchError(error => this.httpErrorService.catchError(error)),
      map(response => this.entityParser.parseRundown(response.data))
    )
  }

  public activate(rundownId: string): Observable<void> {
    return this.http.put<void>(`${RUNDOWN_URL}/${rundownId}/activate`, null).pipe(catchError(error => this.httpErrorService.catchError(error)))
  }

  public rehearsal(rundownId: string): Observable<void> {
    return this.http.put<void>(`${RUNDOWN_URL}/${rundownId}/rehearse`, null).pipe(catchError(error => this.httpErrorService.catchError(error)))
  }

  public deactivate(rundownId: string): Observable<void> {
    return this.http.put<void>(`${RUNDOWN_URL}/${rundownId}/deactivate`, null).pipe(catchError(err => this.httpErrorService.catchError(err)))
  }

  public reset(rundownId: string): Observable<void> {
    return this.http.put<void>(`${RUNDOWN_URL}/${rundownId}/reset`, null).pipe(catchError(err => this.httpErrorService.catchError(err)))
  }

  public takeNext(rundownId: string): Observable<void> {
    return this.http.put<void>(`${RUNDOWN_URL}/${rundownId}/takeNext`, null).pipe(catchError(error => this.httpErrorService.catchError(error)))
  }

  public setNext(rundownId: string, segmentId: string, partId: string): Observable<void> {
    return this.http.put<void>(`${RUNDOWN_URL}/${rundownId}/segments/${segmentId}/parts/${partId}/setNext`, null).pipe(catchError(error => this.httpErrorService.catchError(error)))
  }

  public delete(rundownId: string): Observable<void> {
    return this.http.delete<void>(`${RUNDOWN_URL}/${rundownId}`).pipe(catchError(error => this.httpErrorService.catchError(error)))
  }

  public reingest(rundownId: string): Observable<void> {
    return this.http.post<void>(`${RUNDOWN_URL}/${rundownId}/reingest`, null).pipe(catchError(error => this.httpErrorService.catchError(error)))
  }
}
