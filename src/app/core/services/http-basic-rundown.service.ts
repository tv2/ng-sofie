import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { HttpErrorService } from './http-error.service';
import { catchError, map, Observable } from 'rxjs'
import { BasicRundownService } from '../interfaces/basic-rundown-service';
import { BasicRundown } from "../models/basic-rundown";
import { EntityParser } from './entity-parser.interface'

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
        map(this.entityParser.parseBasicRundowns), // TODO: Catch this and display/log it
        catchError((error) => this.httpErrorService.catchError(error))
      )
  }
}
