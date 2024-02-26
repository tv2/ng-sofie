import { NotificationContainerComponent } from './notification-container.component'
import { instance, mock } from '@typestrong/ts-mockito'
import { ApplicationRef, ElementRef } from '@angular/core'
import { NotificationService } from '../../services/notification.service'
import { StatusMessageEventObserver } from '../../../core/services/status-message-event-observer'
import { SystemInformationService } from '../../services/system-information.service'

describe('NotificationContainerComponent', () => {
  it('should create', () => {
    const testee: NotificationContainerComponent = new NotificationContainerComponent(
      instance(mock(ElementRef)),
      instance(mock(ApplicationRef)),
      instance(mock(NotificationService)),
      instance(mock(StatusMessageEventObserver)),
      instance(mock(SystemInformationService))
    )
    expect(testee).toBeTruthy()
  })
})
