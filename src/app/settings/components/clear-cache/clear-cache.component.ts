import { Component } from '@angular/core'
import { Logger } from '../../../core/abstractions/logger.service'
import { HttpConfigurationCacheService } from '../../services/http-configuration-cache.service'

@Component({
  selector: 'sofie-clear-cache',
  templateUrl: './clear-cache.component.html',
  styleUrls: ['./clear-cache.component.scss'],
})
export class ClearCacheComponent {
  private readonly logger: Logger
  private readonly httpConfigurationCacheService: HttpConfigurationCacheService
  constructor(
    logger: Logger,
    httpConfigurationCacheService: HttpConfigurationCacheService,
  ) {
    this.httpConfigurationCacheService = httpConfigurationCacheService
    this.logger = logger.tag('ClearCacheComponent')
    this.logger.info('constructor')
  }
  public actionClearConfigurationCache(): void {
    this.logger.info('actionClearConfigurationCache')
    this.httpConfigurationCacheService.postClearConfigurationCache().subscribe({
      next: () => {
        this.logger.info('Post success')
      },
      error: err => {
        this.logger.error('Error: ', err)
      },
    })
  }
}
