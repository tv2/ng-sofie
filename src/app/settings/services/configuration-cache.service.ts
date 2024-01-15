import { Observable } from 'rxjs'

export abstract class ConfigurationCacheService {
  public abstract clearConfigurationCache(): Observable<void>
}
