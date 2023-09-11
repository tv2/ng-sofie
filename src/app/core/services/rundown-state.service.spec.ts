import { RundownStateService } from './rundown-state.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { HttpRundownService } from './http-rundown.service'
import { RundownEventObserver } from './rundown-event-observer.service'
import { ConnectionStatusObserver } from './connection-status-observer.service'

describe('RundownStateService', () => {
  it('should be created', () => {
    const mockedRundownService = mock<HttpRundownService>()
    const mockedRundownEventObserver = mock<RundownEventObserver>()
    const mockedConnectionStatusObserver = mock<ConnectionStatusObserver>()
    const testee = new RundownStateService(instance(mockedRundownService), instance(mockedRundownEventObserver), instance(mockedConnectionStatusObserver))
    expect(testee).toBeTruthy()
  })
})
