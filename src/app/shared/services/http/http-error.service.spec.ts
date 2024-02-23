import { HttpErrorService } from './http-error.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { TestLoggerFactory } from '../../../test/factories/test-logger.factory'
import { Logger } from '../../../core/abstractions/logger.service'
import { NotificationService } from '../notification.service'

describe('HttpErrorService', () => {
  it('should be created', () => {
    const testee = new HttpErrorService(instance(mock(NotificationService)), createLogger())
    expect(testee).toBeTruthy()
  })

  function createLogger(): Logger {
    const testLoggerFactory: TestLoggerFactory = new TestLoggerFactory()
    return testLoggerFactory.createLogger()
  }
})
