import { HttpBasicRundownService } from './http-basic-rundown.service'
import { HttpClient } from '@angular/common/http'
import { HttpErrorService } from './http-error.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { EntityParser } from '../abstractions/entity-parser.service'
import { ResponseParser } from '../abstractions/response-parser.service'

describe('HttpBasicRundownService', () => {
  it('should be created', () => {
    const mockedHttpClient = mock<HttpClient>()
    const mockedHttpErrorService = mock<HttpErrorService>()
    const mockedEntityParser = mock<EntityParser>()
    const mockedResponseParser = mock<ResponseParser>()
    expect(new HttpBasicRundownService(instance(mockedHttpClient), instance(mockedHttpErrorService), instance(mockedEntityParser), instance(mockedResponseParser))).toBeTruthy()
  })
})
