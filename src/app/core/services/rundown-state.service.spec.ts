import { RundownStateService } from './rundown-state.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { RundownService } from '../abstractions/rundown.service'
import { RundownEventObserver } from './rundown-event-observer.service'
import { ConnectionStatusObserver } from './connection-status-observer.service'
import { RundownEntityService } from './models/rundown-entity.service'
import { Logger } from '../abstractions/logger.service'
import { TestLoggerFactory } from '../../test/factories/test-logger.factory'

describe('RundownStateService', () => {
  it('should be created', () => {
    const mockedRundownService = mock<RundownService>()
    const mockedRundownEventObserver = mock<RundownEventObserver>()
    const mockedConnectionStatusObserver = mock<ConnectionStatusObserver>()
    const mockedRundownEntityService = mock<RundownEntityService>()

    const testee = new RundownStateService(
      instance(mockedRundownService),
      instance(mockedRundownEventObserver),
      instance(mockedConnectionStatusObserver),
      instance(mockedRundownEntityService),
      createLogger()
    )
    expect(testee).toBeTruthy()
  })
})

function createLogger(): Logger {
  const testLoggerFactory: TestLoggerFactory = new TestLoggerFactory()
  return testLoggerFactory.createLogger()
}
