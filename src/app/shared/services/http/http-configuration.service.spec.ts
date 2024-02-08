import { instance, mock } from '@typestrong/ts-mockito'
import { HttpClient } from '@angular/common/http'
import { HttpErrorService } from './http-error.service'
import { HttpConfigurationService } from './http-configuration-service'
import { ConfigurationParser } from '../../abstractions/configuration-parser.service'

describe(HttpConfigurationService.name, () => {
  describe(HttpConfigurationService.prototype.getStudioConfiguration.name, () => {
    it('should create', () => {
      const mockedHttpClient: HttpClient = mock<HttpClient>()
      const mockedHttpErrorService: HttpErrorService = mock<HttpErrorService>()
      const mockedConfigurationParser: ConfigurationParser = mock<ConfigurationParser>()
      const testee: HttpConfigurationService = new HttpConfigurationService(instance(mockedHttpClient), instance(mockedHttpErrorService), instance(mockedConfigurationParser))
      expect(testee).toBeTruthy()
      expect(testee.getStudioConfiguration).toBeTruthy()
    })
  })
})
