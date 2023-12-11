import { Observable } from 'rxjs'
import { BasicRundown } from '../../core/models/basic-rundown'

export abstract class BasicRundownService {
  public abstract fetchBasicRundowns(): Observable<BasicRundown[]>
}
