import { MiniShelfStateService } from './mini-shelf-state.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { Logger } from '../../core/abstractions/logger.service'
import { RundownEventObserver } from '../../core/services/rundown-event-observer.service'
import { ActionService } from '../../shared/abstractions/action.service'

function createTestee(): MiniShelfStateService {
  const mockedActionService: ActionService = mock<ActionService>()
  const actionService: ActionService = instance(mockedActionService)
  const mockedRundownEventObserver: RundownEventObserver = mock<RundownEventObserver>()
  const rundownEventObserver: RundownEventObserver = instance(mockedRundownEventObserver)
  const mockedLogger: Logger = mock<Logger>()
  const logger: Logger = instance(mockedLogger)
  return new MiniShelfStateService(actionService, rundownEventObserver, logger)
}

describe(MiniShelfStateService.name, (): void => {
  describe(MiniShelfStateService.prototype.findMiniShelfGroup.name, (): void => {
    it('should create', (): void => {
      const testee = createTestee()
      expect(testee).toBeTruthy()
    })
  })
})
