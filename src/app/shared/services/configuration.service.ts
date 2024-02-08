import { StudioConfiguration } from '../models/studio-configuration'
import { Observable } from 'rxjs'
import { Shelf } from '../models/shelf'

export abstract class ConfigurationService {
  public abstract getStudioConfiguration(): Observable<StudioConfiguration>
  public abstract getShelfConfiguration(): Observable<Shelf>
}
