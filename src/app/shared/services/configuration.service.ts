import { ShelfActionPanelConfiguration, ShelfConfiguration } from '../models/shelf-configuration'
import { StudioConfiguration } from '../models/studio-configuration'
import { Observable } from 'rxjs'

export abstract class ConfigurationService {
  public abstract getStudioConfiguration(): Observable<StudioConfiguration>
  public abstract getShelfConfiguration(): Observable<ShelfConfiguration<ShelfActionPanelConfiguration>>
  public abstract updateShelfConfiguration(shelfConfiguration: ShelfConfiguration<ShelfActionPanelConfiguration>): Observable<void>
  public abstract clearConfigurationCache(): Observable<void>
}
