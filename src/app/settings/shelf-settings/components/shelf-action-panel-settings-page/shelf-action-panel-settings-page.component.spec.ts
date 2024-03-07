import { ShelfActionPanelSettingsPageComponent } from './shelf-action-panel-settings-page.component'
import { instance, mock } from '@typestrong/ts-mockito'
import { ConfigurationService } from '../../../../shared/services/configuration.service'
import { ConfigurationEventObserver } from '../../../../core/services/configuration-event-observer'
import { DialogService } from '../../../../shared/services/dialog.service'
import { ConfigurationParser } from '../../../../shared/abstractions/configuration-parser.service'
import { TranslationActionTypePipe } from '../../../../shared/pipes/translation-known-values.pipe'
import { NotificationService } from '../../../../shared/services/notification.service'

describe('ShelfActionPanelSettingsPageComponent', () => {
  it('should create', () => {
    const testee: ShelfActionPanelSettingsPageComponent = new ShelfActionPanelSettingsPageComponent(
      instance(mock(ConfigurationService)),
      instance(mock(ConfigurationEventObserver)),
      instance(mock(ConfigurationParser)),
      instance(mock(DialogService)),
      instance(mock(TranslationActionTypePipe)),
      instance(mock(NotificationService))
    )
    expect(testee).toBeTruthy()
  })
})
