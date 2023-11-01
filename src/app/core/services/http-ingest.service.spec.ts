import { HttpClient } from '@angular/common/http'
import { HttpErrorService } from './http-error.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { HttpIngestService } from './http-ingest.service'

describe('HttpIngestService', () => {
  it('should be created', () => {
    const mockedHttpClient = mock<HttpClient>()
    const mockedHttpErrorService = mock<HttpErrorService>()
    expect(new HttpIngestService(instance(mockedHttpClient), instance(mockedHttpErrorService))).toBeTruthy()
  })
})
