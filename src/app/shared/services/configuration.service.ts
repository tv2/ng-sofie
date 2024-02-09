import { StudioConfiguration } from '../models/studio-configuration'
import { Observable } from 'rxjs'
import { ShelfConfiguration } from '../models/shelf-configuration'

export abstract class ConfigurationService {
  public abstract getStudioConfiguration(): Observable<StudioConfiguration>
  public abstract getShelfConfiguration(): Observable<ShelfConfiguration>
}
