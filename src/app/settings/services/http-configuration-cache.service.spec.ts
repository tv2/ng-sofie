import { instance, mock, verify } from '@typestrong/ts-mockito'
import { Logger } from '../../core/abstractions/logger.service'
import { HttpConfigurationCacheService } from './http-configuration-cache.service'
import { HttpClient } from '@angular/common/http'
import { HttpErrorService } from '../../shared/services/http/http-error.service'

describe('HttpConfigurationCacheService', () => {
  it('should be created', () => {
    const mockLogger: Logger = mock<Logger>()
    const mockHttpClient: HttpClient = mock<HttpClient>()
    const mockHttpErrorService: HttpErrorService = mock<HttpErrorService>()
    const testee: HttpConfigurationCacheService = new HttpConfigurationCacheService(
      instance(mockLogger),
      instance(mockHttpClient),
      instance(mockHttpErrorService),
    )
    expect(testee).toBeTruthy()
    testee.postClearConfigurationCache()
    verify(mockHttpClient.post).once()
  })
})
