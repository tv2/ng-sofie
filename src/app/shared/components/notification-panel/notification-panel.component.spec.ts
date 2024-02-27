import { NotificationPanelComponent } from './notification-panel.component'
import { instance, mock } from '@typestrong/ts-mockito'
import { NotificationService } from '../../services/notification.service'
import { SystemInformationService } from '../../services/system-information.service'

describe('NotificationPanelComponent', () => {
  it('should create', () => {
    const testee: NotificationPanelComponent = new NotificationPanelComponent(instance(mock(NotificationService)), instance(mock(SystemInformationService)))
    expect(testee).toBeTruthy()
  })
})
