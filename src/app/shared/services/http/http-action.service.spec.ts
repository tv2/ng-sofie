import { instance, mock } from '@typestrong/ts-mockito'
import { HttpClient } from '@angular/common/http'
import { HttpErrorService } from './http-error.service'
import { HttpActionService } from './http-action.service'
import { ActionParser } from '../../abstractions/action-parser.service'

describe('HttpActionService', () => {
  it('should be created', () => {
    const mockedHttpClient = mock<HttpClient>()
    const mockedHttpErrorService = mock<HttpErrorService>()
    const mockedActionParser = mock<ActionParser>()
    expect(new HttpActionService(instance(mockedHttpClient), instance(mockedHttpErrorService), instance(mockedActionParser))).toBeTruthy()
  })
})
