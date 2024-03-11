import { Observable } from 'rxjs'
import { SystemInformation } from '../models/system-information'
import { StatusMessage } from '../models/status-message'

export abstract class SystemInformationService {
  public abstract getSystemInformation(): Observable<SystemInformation>
  public abstract getStatusMessages(): Observable<StatusMessage[]>
}
