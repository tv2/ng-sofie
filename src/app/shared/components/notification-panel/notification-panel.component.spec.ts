import { NotificationPanelComponent } from './notification-panel.component'
import { instance, mock } from '@typestrong/ts-mockito'
import { NotificationService } from '../../services/notification.service'
import { SystemInformationService } from '../../services/system-information.service'
import { ConnectionStatusObserver } from '../../../core/services/connection-status-observer.service'

describe('NotificationPanelComponent', () => {
  it('should create', () => {
    const testee: NotificationPanelComponent = new NotificationPanelComponent(instance(mock(NotificationService)), instance(mock(SystemInformationService)), instance(mock(ConnectionStatusObserver)))
    expect(testee).toBeTruthy()
  })
})
