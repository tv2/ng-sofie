import { environment } from '../../../environments/environment'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { HttpErrorService } from './http-error.service'
import { IngestService } from '../abstractions/ingest-service'
import { catchError, Observable } from 'rxjs'

const INGEST_URL: string = `${environment.apiBaseUrl}/ingest`

@Injectable()
export class HttpIngestService implements IngestService {
  constructor(
    private readonly http: HttpClient,
    private readonly httpErrorService: HttpErrorService
  ) {}

  public reingestRundownData(rundownId: string): Observable<void> {
    const url: string = `${INGEST_URL}/reloadData/rundowns/${rundownId}`
    return this.http.post<void>(url, null).pipe(catchError(error => this.httpErrorService.catchError(error)))
  }
}
