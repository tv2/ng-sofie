import { NotificationPopupContainerComponent } from './notification-popup-container.component'
import { instance, mock } from '@typestrong/ts-mockito'
import { NotificationService } from '../../services/notification.service'

describe(NotificationPopupContainerComponent.name, () => {
  it('should create', () => {
    const testee: NotificationPopupContainerComponent = new NotificationPopupContainerComponent(instance(mock(NotificationService)))
    expect(testee).toBeTruthy()
  })
})
