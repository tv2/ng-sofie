import { Injectable } from '@angular/core'
import { StudioConfiguration } from './studio-configuration'
import { Observable } from 'rxjs'

@Injectable()
export abstract class ConfigurationService {
  public abstract getStudioConfiguration(): Observable<StudioConfiguration>
}
