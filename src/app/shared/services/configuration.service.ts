import { StudioConfiguration } from '../models/studio-configuration'
import { Observable } from 'rxjs'

export abstract class ConfigurationService {
  public abstract getStudioConfiguration(): Observable<StudioConfiguration>
}
