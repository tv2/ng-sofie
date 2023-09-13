import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { HttpErrorService } from './http-error.service';
import { catchError, map, Observable } from 'rxjs'
import { BasicRundownService } from '../abstractions/basic-rundown.service';
import { BasicRundown } from "../models/basic-rundown";
import { EntityParser } from '../abstractions/entity-parser.service'

// TODO: Change when we get a setup for handling configurations.
const RUNDOWN_URL: string = 'http://localhost:3005/api/rundowns'

@Injectable()
export class HttpBasicRundownService implements BasicRundownService {
  constructor(
    private readonly http: HttpClient,
    private readonly httpErrorService: HttpErrorService,
    private readonly entityParser: EntityParser
  ) {}

  public fetchBasicRundowns(): Observable<BasicRundown[]> {
    return this.http.get<unknown>(`${RUNDOWN_URL}/basic`)
      .pipe(
        catchError((error) => this.httpErrorService.catchError(error)),
        map(this.entityParser.parseBasicRundowns.bind(this.entityParser)) // TODO: Catch this and display/log it
      )
  }
}
