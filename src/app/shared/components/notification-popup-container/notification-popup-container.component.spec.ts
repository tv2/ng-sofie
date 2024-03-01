import { NotificationPopupContainerComponent } from './notification-popup-container.component'
import { instance, mock } from '@typestrong/ts-mockito'
import { ApplicationRef, ElementRef } from '@angular/core'
import { NotificationService } from '../../services/notification.service'

describe(NotificationPopupContainerComponent.name, () => {
  it('should create', () => {
    const testee: NotificationPopupContainerComponent = new NotificationPopupContainerComponent(instance(mock(ElementRef)), instance(mock(ApplicationRef)), instance(mock(NotificationService)))
    expect(testee).toBeTruthy()
  })
})
