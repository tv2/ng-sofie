import { HttpBasicRundownService } from './http-basic-rundown.service'
import { HttpClient } from '@angular/common/http'
import { HttpErrorService } from '../../../shared/services/http/http-error.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { EntityValidator } from '../../abstractions/entity-parser.service'

describe('HttpBasicRundownService', () => {
  it('should be created', () => {
    const mockedHttpClient = mock<HttpClient>()
    const mockedHttpErrorService = mock<HttpErrorService>()
    const mockedEntityParser = mock<EntityValidator>()
    expect(new HttpBasicRundownService(instance(mockedHttpClient), instance(mockedHttpErrorService), instance(mockedEntityParser))).toBeTruthy()
  })
})
