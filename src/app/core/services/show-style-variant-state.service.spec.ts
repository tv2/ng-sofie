import { instance, mock } from '@typestrong/ts-mockito'
import { ShowStyleVariantService } from '../abstractions/show-style-variant.service'
import { ShowStyleVariantStateService } from './show-style-variant-state.service'
import { RundownEventObserver } from './rundown-event-observer.service'
import { Logger } from '../abstractions/logger.service'

describe('ShowStyleVariantStateService', () => {
  it('should be created', () => {
    const mockedShowStyleVariantService = mock<ShowStyleVariantService>()
    const mockedRundownEventObserver = mock<RundownEventObserver>()
    const mockedLogger = mock<Logger>()
    const testee = new ShowStyleVariantStateService(instance(mockedShowStyleVariantService), instance(mockedRundownEventObserver), instance(mockedLogger))
    expect(testee).toBeTruthy()
  })
})
