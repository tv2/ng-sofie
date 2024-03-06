import { ShelfActionPanelSettingsPageComponent } from './shelf-action-panel-settings-page.component'
import { instance, mock } from '@typestrong/ts-mockito'
import { ConfigurationService } from '../../../../shared/services/configuration.service'
import { ConfigurationEventObserver } from '../../../../core/services/configuration-event-observer'
import { DialogService } from '../../../../shared/services/dialog.service'

describe('ShelfActionPanelSettingsPageComponent', () => {
  it('should create', () => {
    const testee: ShelfActionPanelSettingsPageComponent = new ShelfActionPanelSettingsPageComponent(
      instance(mock(ConfigurationService)),
      instance(mock(ConfigurationEventObserver)),
      instance(mock(DialogService))
    )
    expect(testee).toBeTruthy()
  })
})
