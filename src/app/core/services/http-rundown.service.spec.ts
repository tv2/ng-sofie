import { HttpRundownService } from './http-rundown.service';
import { HttpErrorService } from './http-error.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { HttpClient } from '@angular/common/http'
import { EntityParser } from './entity-parser.interface'

describe('HttpRundownService', () => {
  it('should be created', () => {
    const mockedHttpClient = mock<HttpClient>()
    const mockedHttpErrorService = mock<HttpErrorService>()
    const mockedEntityParser = mock<EntityParser>()
    expect(new HttpRundownService(instance(mockedHttpClient), instance(mockedHttpErrorService), instance(mockedEntityParser))).toBeTruthy();
  });
});
