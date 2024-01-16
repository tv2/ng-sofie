import { HttpConfigurationService } from './http/http-configuration-service'
import { Injectable } from '@angular/core'
import { StudioConfiguration } from '../../core/models/studio-configuration'
import { Observable } from 'rxjs'

@Injectable()
export class ConfigurationService {
  constructor(private readonly httpConfigurationService: HttpConfigurationService) {}

  public getStudioConfiguration(): Observable<StudioConfiguration> {
    return this.httpConfigurationService.getStudioConfiguration()
  }
}
