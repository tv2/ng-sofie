import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {catchError, map, Observable} from 'rxjs'
import {RundownServiceInterface} from '../interfaces/rundown-service-interface';
import {HttpErrorService} from './http-error.service';
import {Rundown, RundownInterface} from '../models/rundown';

const RUNDOWN_URL: string = 'http://localhost:3005/api/rundowns'

@Injectable()
export class RundownService implements RundownServiceInterface {

  constructor(
    private http: HttpClient,
    private httpErrorService: HttpErrorService
  ) { }

  public fetchRundown(rundownId: string): Observable<Rundown> {
    return this.http.get<RundownInterface>(`${RUNDOWN_URL}/${rundownId}`).pipe(
      map((value: RundownInterface) => new Rundown(value)),
      catchError((error) => this.httpErrorService.catchError(error))
    )
  }

  public activate(rundownId: string): Observable<void> {
    return this.http.put<void>(`${RUNDOWN_URL}/${rundownId}/activate`, null)
      .pipe(
        catchError((error) => this.httpErrorService.catchError(error))
      )
  }

  public deactivate(rundownId: string): Observable<void> {
    return this.http.put<void>(`${RUNDOWN_URL}/${rundownId}/deactivate`, null)
      .pipe(
        catchError((err) => this.httpErrorService.catchError(err))
      )
  }

  public reset(rundownId: string): Observable<void> {
    return this.http.put<void>(`${RUNDOWN_URL}/${rundownId}/reset`, null)
      .pipe(
        catchError((err) => this.httpErrorService.catchError(err))
      )
  }

  public takeNext(rundownId: string): Observable<void> {
    return this.http.put<void>(`${RUNDOWN_URL}/${rundownId}/takeNext`, null)
      .pipe(
        catchError((error) => this.httpErrorService.catchError(error))
      )
  }

  public setNext(rundownId: string, segmentId: string, partId: string): Observable<void> {
    return this.http.put<void>(`${RUNDOWN_URL}/${rundownId}/segments/${segmentId}/parts/${partId}/setNext`, null)
      .pipe(
        catchError((error) => this.httpErrorService.catchError(error))
      )
  }
}
