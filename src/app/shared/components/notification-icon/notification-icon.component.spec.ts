import { NotificationIconComponent } from './notification-icon.component'
import { instance, mock } from '@typestrong/ts-mockito'
import { NotificationService } from '../../services/notification.service'

describe('NotificationIconComponent', () => {
  it('should create', () => {
    const testee: NotificationIconComponent = new NotificationIconComponent(instance(mock(NotificationService)))
    expect(testee).toBeTruthy()
  })
})
