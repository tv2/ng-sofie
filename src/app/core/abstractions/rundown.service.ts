import { Observable } from 'rxjs'
import { Rundown } from '../models/rundown'

export abstract class RundownService {
  public abstract fetchRundown(rundownId: string): Observable<Rundown>
  public abstract activate(rundownId: string): Observable<void>
  public abstract rehearse(rundownId: string): Observable<void>
  public abstract deactivate(rundownId: string): Observable<void>
  public abstract reset(rundownId: string): Observable<void>
  public abstract takeNext(rundownId: string): Observable<void>
  public abstract setNext(rundownId: string, segmentId: string, partId: string): Observable<void>
  public abstract reingest(rundownId: string): Observable<void>
  public abstract delete(rundownId: string): Observable<void>
}
