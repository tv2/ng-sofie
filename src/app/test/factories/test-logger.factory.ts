import { Logger } from '../../core/abstractions/logger.service'
import { anyString, anything, instance, mock, when } from '@typestrong/ts-mockito'

export class TestLoggerFactory {
  public createLogger(): Logger {
    const mockedLogger: Logger = mock<Logger>()
    when(mockedLogger.tag(anyString())).thenCall(() => this.createLogger())
    when(mockedLogger.data(anything())).thenCall(() => this.createLogger())
    when(mockedLogger.metadata(anything())).thenCall(() => this.createLogger())
    return instance(mockedLogger)
  }
}
