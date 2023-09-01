import { RundownStateService } from './rundown-state.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { RundownService } from './rundown.service'
import { RundownEventService } from './rundown-event.service'

describe('RundownStateService', () => {
  it('should be created', () => {
    const mockedRundownService = createMockOfRundownService()
    const mockedRundownEventService = createMockOfRundownEventService()
    const service = new RundownStateService(instance(mockedRundownService), instance(mockedRundownEventService))
    expect(service).toBeTruthy()
  })
})

function createMockOfRundownService(): RundownService {
  return mock<RundownService>()
}

function createMockOfRundownEventService(): RundownEventService {
  return mock<RundownEventService>()
}
