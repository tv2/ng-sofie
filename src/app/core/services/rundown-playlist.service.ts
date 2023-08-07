import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpErrorService} from './http-error.service';
import {catchError, Observable} from 'rxjs';
import {Identifier} from '../models/identifier';
import {RundownPlaylistServiceInterface} from '../interfaces/rundown-playlist-service-interface';

// TODO: Change when we get RundownPlaylists endpoint
const RUNDOWN_URL: string = 'http://localhost:3005/api/rundowns'

@Injectable()
export class RundownPlaylistService implements RundownPlaylistServiceInterface {

  constructor(
    private http: HttpClient,
    private httpErrorService: HttpErrorService
  ) { }

  public fetchRundownPlaylistIdentifiers(): Observable<Identifier[]> {
    return this.http.get<Identifier[]>(`${RUNDOWN_URL}/identifiers`)
      .pipe(
        catchError((error) => this.httpErrorService.catchError(error))
      )
  }
}
