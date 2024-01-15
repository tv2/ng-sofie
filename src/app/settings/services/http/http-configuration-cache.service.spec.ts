import { instance, mock } from '@typestrong/ts-mockito'
import { HttpConfigurationCacheService } from './http-configuration-cache.service'
import { HttpClient } from '@angular/common/http'
import { HttpErrorService } from '../../../shared/services/http/http-error.service'

describe(HttpConfigurationCacheService.name, (): void => {
  describe(HttpConfigurationCacheService.prototype.clearConfigurationCache.name, (): void => {
    it('should create', (): void => {
      const mockHttpClient: HttpClient = mock<HttpClient>()
      const mockHttpErrorService: HttpErrorService = mock<HttpErrorService>()
      const testee: HttpConfigurationCacheService = new HttpConfigurationCacheService(instance(mockHttpClient), instance(mockHttpErrorService))
      expect(testee).toBeTruthy()
    })
  })
})
