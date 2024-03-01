import { ConnectionErrorService } from './connection-error.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { ConnectionStatusObserver } from '../../core/services/connection-status-observer.service'
import { NotificationService } from './notification.service'

describe('ConnectionErrorService', () => {
  it('should be created', () => {
    const mockedConnectionStatusObserver = mock<ConnectionStatusObserver>()
    expect(new ConnectionErrorService(instance(mock(NotificationService)), instance(mockedConnectionStatusObserver))).toBeTruthy()
  })
})
