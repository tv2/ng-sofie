import { HttpErrorService } from '../http-error.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { instance, mock } from '@typestrong/ts-mockito'
import { TestLoggerFactory } from '../../../../test/factories/test-logger.factory'
import { Logger } from '../../../../core/abstractions/logger.service'

describe('HttpErrorService', () => {
  it('should be created', () => {
    const mockedMatSnackBar = mock<MatSnackBar>()
    const testee = new HttpErrorService(instance(mockedMatSnackBar), createLogger())
    expect(testee).toBeTruthy()
  })

  function createLogger(): Logger {
    const testLoggerFactory: TestLoggerFactory = new TestLoggerFactory()
    return testLoggerFactory.createLogger()
  }
})
