import { RundownStateService } from './rundown-state.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { RundownService } from '../abstractions/rundown.service'
import { RundownEventObserver } from './rundown-event-observer.service'
import { ConnectionStatusObserver } from './connection-status-observer.service'
import { RundownEntityService } from './models/rundown-entity.service'
import { Logger } from '../abstractions/logger.service'
import { TestLoggerFactory } from '../../test/factories/test-logger.factory'
import { BasicRundownStateService } from './basic-rundown-state.service'
import { DialogService } from '../../shared/services/dialog.service'

describe('RundownStateService', () => {
  it('should be created', () => {
    const mockedRundownService = mock<RundownService>()
    const mockedBasicRundownStateService: BasicRundownStateService = mock<BasicRundownStateService>()
    const mockedDialogService = mock<DialogService>()
    const mockedRundownEventObserver = mock<RundownEventObserver>()
    const mockedConnectionStatusObserver = mock<ConnectionStatusObserver>()
    const mockedRundownEntityService = mock<RundownEntityService>()

    const testee = new RundownStateService(
      instance(mockedRundownService),
      instance(mockedBasicRundownStateService),
      instance(mockedDialogService),
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
