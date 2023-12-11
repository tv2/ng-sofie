import { HttpErrorService } from '../../../../shared/services/http/http-error.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { HttpClient } from '@angular/common/http'
import { EntityParser } from '../../../abstractions/entity-parser.service'
import { HttpShowStyleVariantService } from '../http-show-style-variant.service'

describe('HttpConfigurationService', () => {
  it('should be created', () => {
    const mockedHttpClient = mock<HttpClient>()
    const mockedHttpErrorService = mock<HttpErrorService>()
    const mockedEntityParser = mock<EntityParser>()
    expect(new HttpShowStyleVariantService(instance(mockedHttpClient), instance(mockedHttpErrorService), instance(mockedEntityParser))).toBeTruthy()
  })
})
