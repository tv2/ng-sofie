import { KeyboardMappingSettingsPageComponent } from './keyboard-mapping-settings-page.component'
import { instance, mock } from '@typestrong/ts-mockito'
import { ActionTriggerStateService } from 'src/app/core/services/action-trigger-state.service'
import { Logger } from 'src/app/core/abstractions/logger.service'
import { ActionStateService } from 'src/app/shared/services/action-state.service'
import { ActionTriggerService } from '../../../../shared/abstractions/action-trigger.service'
import { ActionTriggerParser } from '../../../../shared/abstractions/action-trigger-parser.service'
import { DialogService } from '../../../../shared/services/dialog.service'
import { NotificationService } from '../../../../shared/services/notification.service'
import { FormatKeyboardKeysPipe } from '../../../../shared/pipes/format-keyboard-keys.pipe'

describe('KeyboardMappingPageComponent', () => {
  it('should create', () => {
    const testee: KeyboardMappingSettingsPageComponent = new KeyboardMappingSettingsPageComponent(
      instance(mock(ActionTriggerStateService)),
      instance(mock(ActionTriggerService)),
      instance(mock(ActionTriggerParser)),
      instance(mock(ActionStateService)),
      instance(mock(DialogService)),
      instance(mock(NotificationService)),
      instance(mock(FormatKeyboardKeysPipe)),
      instance(mock(Logger))
    )
    expect(testee).toBeTruthy()
  })
})
