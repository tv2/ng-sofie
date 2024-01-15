import { Component } from '@angular/core'
import { ConfigurationCacheService } from '../../services/configuration-cache.service'
import { DialogService } from 'src/app/shared/services/dialog.service'

@Component({
  selector: 'sofie-clear-cache',
  templateUrl: './clear-cache.component.html',
  styleUrls: ['./clear-cache.component.scss'],
})
export class ClearCacheComponent {
  constructor(
    private readonly configurationCacheService: ConfigurationCacheService,
    private readonly dialogService: DialogService
  ) {}

  public showClearCacheConfirmModal(): void {
    this.dialogService.createConfirmDialog($localize`global.confirmation.label`, $localize`clear-cache.clear.confirmation`, $localize`global.clear.label`, () => this.actionClearConfigurationCache())
  }

  public actionClearConfigurationCache(): void {
    this.configurationCacheService.clearConfigurationCache().subscribe()
  }
}
