import { HttpConfigurationService } from './http/http-configuration-service'
import { Injectable } from '@angular/core'
import { Configuration } from '../../core/models/configuration'
import { lastValueFrom } from 'rxjs'
import { StudioConfiguration } from './studio-configuration'

@Injectable()
export class ConfigurationService {
  constructor(private readonly httpConfigurationService: HttpConfigurationService) {}

  public async getStudioConfiguration(): Promise<StudioConfiguration> {
    const configuration: Configuration = await lastValueFrom(this.httpConfigurationService.getStudioConfiguration())
    return new StudioConfiguration(configuration.data.settings.mediaPreviewUrl)
  }
}
