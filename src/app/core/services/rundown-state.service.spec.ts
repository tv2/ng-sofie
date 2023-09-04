import { RundownStateService } from './rundown-state.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { RundownService } from './rundown.service'
import { RundownEventService } from './rundown-event.service'

describe('RundownStateService', () => {
  it('should be created', () => {
    const mockedRundownService = mock<RundownService>()
    const mockedRundownEventService = mock<RundownEventService>()
    const service = new RundownStateService(instance(mockedRundownService), instance(mockedRundownEventService))
    expect(service).toBeTruthy()
  })
})
