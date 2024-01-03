import { HttpRundownService } from './http-rundown.service'
import { HttpErrorService } from '../../../shared/services/http/http-error.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { HttpClient } from '@angular/common/http'
import { EntityValidator } from '../../abstractions/entity-validator.service'

describe('HttpRundownService', () => {
  it('should be created', () => {
    const mockedHttpClient = mock<HttpClient>()
    const mockedHttpErrorService = mock<HttpErrorService>()
    const mockedEntityParser = mock<EntityValidator>()
    expect(new HttpRundownService(instance(mockedHttpClient), instance(mockedHttpErrorService), instance(mockedEntityParser))).toBeTruthy()
  })
})
