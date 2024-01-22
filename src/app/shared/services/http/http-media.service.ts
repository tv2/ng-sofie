import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { HttpErrorService } from './http-error.service'
import { environment } from '../../../../environments/environment'
import { catchError, map, Observable } from 'rxjs'
import { HttpResponse } from './http-response'
import { EntityParser } from '../../../core/abstractions/entity-parser.service'
import { MediaService } from '../media.service'
import { Media } from '../media'

@Injectable()
export class HttpMediaService implements MediaService {
  constructor(
    private readonly http: HttpClient,
    private readonly httpErrorService: HttpErrorService,
    private readonly entityParser: EntityParser
  ) {}

  public getMedia(id: string): Observable<Media> {
    return this.http.get<HttpResponse<Media>>(`${environment.apiBaseUrl}/media/${id}`).pipe(
      catchError(error => this.httpErrorService.catchError(error)),
      map(response => this.entityParser.parseMediaData(response))
    )
  }
}
