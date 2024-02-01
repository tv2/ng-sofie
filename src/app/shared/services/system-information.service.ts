import { Observable } from 'rxjs'
import { SystemInformation } from '../models/system-information'

export abstract class SystemInformationService {
  public abstract getSystemInformation(): Observable<SystemInformation>
}
