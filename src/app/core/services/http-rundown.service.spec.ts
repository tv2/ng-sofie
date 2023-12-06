import { HttpRundownService } from './http-rundown.service'
import { HttpErrorService } from './http-error.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { HttpClient } from '@angular/common/http'
import { EntityParser } from '../abstractions/entity-parser.service'
import { ResponseParser } from '../abstractions/response-parser.service'

describe('HttpRundownService', () => {
  it('should be created', () => {
    const mockedHttpClient = mock<HttpClient>()
    const mockedHttpErrorService = mock<HttpErrorService>()
    const mockedEntityParser = mock<EntityParser>()
    const mockedResponseParser = mock<ResponseParser>()
    expect(new HttpRundownService(instance(mockedHttpClient), instance(mockedHttpErrorService), instance(mockedEntityParser), instance(mockedResponseParser))).toBeTruthy()
  })
})
