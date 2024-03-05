import { Component, Input } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ConfigurationService } from 'src/app/shared/services/configuration.service'
import { ConfigurationParser } from 'src/app/shared/abstractions/configuration-parser.service'
import { ShelfActionPanelConfiguration, ShelfActionPanelConfigurationWithId, ShelfConfiguration } from 'src/app/shared/models/shelf-configuration'

@Component({
  selector: 'sofie-action-panel-import',
  templateUrl: './action-panel-import.component.html',
  styleUrls: ['./action-panel-import.component.scss'],
})
export class ActionPanelImportComponent {
  @Input() public shelfConfiguration: ShelfConfiguration<ShelfActionPanelConfigurationWithId>

  public readonly importLabel = $localize`global.import.button`

  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly configurationParser: ConfigurationParser,
    private readonly snackBar: MatSnackBar
  ) {}

  public uploadFile(inputElement: HTMLInputElement): void {
    const files = inputElement.files
    if (!files?.[0]) {
      this.openDangerSnackBar('Error in imported file')
      return
    }
    const reader = new FileReader()
    reader.onload = (readerProcessEvent: ProgressEvent<FileReader>): void => {
      try {
        const importedActionTriggers: ShelfConfiguration<ShelfActionPanelConfiguration> = this.configurationParser.parseShelfConfiguration(
          JSON.parse(readerProcessEvent?.target?.result ? readerProcessEvent.target.result.toString() : '')
        )
        if (!importedActionTriggers || importedActionTriggers.actionPanelConfigurations.length === 0) {
          this.openDangerSnackBar('No items to be added')
          return
        }
        this.importActionPanel(importedActionTriggers)
      } catch {
        this.openDangerSnackBar('Error in imported file')
      }
      inputElement.value = ''
    }
    reader.readAsText(files[0])
  }

  private importActionPanel(actionPanelsToImport: ShelfConfiguration<ShelfActionPanelConfiguration>): void {
    const fullShelfConfiguration: ShelfConfiguration<ShelfActionPanelConfiguration> = {
      id: this.shelfConfiguration.id,
      actionPanelConfigurations: [...this.removeIdFromConfigurations(this.shelfConfiguration.actionPanelConfigurations), ...actionPanelsToImport.actionPanelConfigurations],
    }
    this.configurationService.updateShelfConfiguration(fullShelfConfiguration).subscribe()
  }

  private removeIdFromConfigurations(actionPanelConfigurations: ShelfActionPanelConfigurationWithId[]): ShelfActionPanelConfiguration[] {
    return [
      ...actionPanelConfigurations.map(panelConfiguration => {
        return {
          actionFilter: panelConfiguration.actionFilter,
          name: panelConfiguration.name,
          rank: panelConfiguration.rank,
        }
      }),
    ]
  }

  private openDangerSnackBar(message: string): void {
    this.snackBar.open(message, $localize`global.dismiss.label`, { panelClass: 'snackbar-danger' })
  }
}
