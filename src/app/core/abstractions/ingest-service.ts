import { Observable } from 'rxjs'

export abstract class IngestService {
  public abstract reingestRundownData(rundownId: string): Observable<void>
}
