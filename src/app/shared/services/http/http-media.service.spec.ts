import { instance, mock } from '@typestrong/ts-mockito'
import { HttpClient } from '@angular/common/http'
import { HttpErrorService } from './http-error.service'
import { HttpMediaService } from './http-media.service'
import { EntityParser } from '../../../core/abstractions/entity-parser.service'

describe(HttpMediaService.name, () => {
  describe(HttpMediaService.prototype.getMedia.name, () => {
    it('should create', () => {
      const mockedHttpClient: HttpClient = mock<HttpClient>()
      const mockedHttpErrorService: HttpErrorService = mock<HttpErrorService>()
      const mockedEntityParser: EntityParser = mock<EntityParser>()
      const testee: HttpMediaService = new HttpMediaService(instance(mockedHttpClient), instance(mockedHttpErrorService), instance(mockedEntityParser))
      expect(testee).toBeTruthy()
      expect(testee.getMedia).toBeTruthy()
    })
  })
})
