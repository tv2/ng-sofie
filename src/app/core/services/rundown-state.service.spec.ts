import { RundownStateService } from './rundown-state.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { HttpRundownService } from './http-rundown.service'
import { RundownEventObserver } from './events/rundown-event-observer.service'
import { ConnectionStatusObserver } from '../../event-system/services/connection-status-observer.service'

describe('RundownStateService', () => {
  it('should be created', () => {
    const mockedRundownService = mock<HttpRundownService>()
    const mockedRundownEventObserver = mock<RundownEventObserver>()
    const mockedConnectionStatusObserver = mock<ConnectionStatusObserver>()
    const service = new RundownStateService(instance(mockedRundownService), instance(mockedRundownEventObserver), instance(mockedConnectionStatusObserver))
    expect(service).toBeTruthy()
  })
})
