import { Component } from '@angular/core'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { ConfigurationService } from '../../../shared/services/configuration.service'
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'sofie-clear-cache',
  templateUrl: './clear-cache.component.html',
  styleUrls: ['./clear-cache.component.scss'],
})
export class ClearCacheComponent {
  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly dialogService: DialogService,
    private readonly snackbar: MatSnackBar
  ) {}

  public showClearCacheConfirmModal(): void {
    this.dialogService.createConfirmDialog($localize`global.confirmation.label`, $localize`clear-cache.clear.confirmation`, $localize`global.clear.label`, () => this.clearConfigurationCache())
  }

  public clearConfigurationCache(): void {
    this.configurationService.clearConfigurationCache().subscribe(() => {
      // Note: This functionality is only until we control the entire settings page, so there should be no need for translation.
      this.snackbar.open('The configuration cache was cleared', $localize`global.dismiss.label`, {
        panelClass: 'snackbar-success',
      })
    })
  }
}
