import { Component } from '@angular/core'
import { HttpConfigurationCacheService } from '../../services/http-configuration-cache.service'

@Component({
  selector: 'sofie-clear-cache',
  templateUrl: './clear-cache.component.html',
  styleUrls: ['./clear-cache.component.scss'],
})
export class ClearCacheComponent {
  constructor(private readonly httpConfigurationCacheService: HttpConfigurationCacheService) {
    this.httpConfigurationCacheService = httpConfigurationCacheService
  }
  public actionClearConfigurationCache(): void {
    this.httpConfigurationCacheService.postClearConfigurationCache().subscribe()
  }
}
