import { HttpBasicRundownService } from './http-basic-rundown.service';
import { HttpClient } from '@angular/common/http'
import { HttpErrorService } from './http-error.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { EntityParserService } from '../abstractions/entity-parser.service'

describe('HttpBasicRundownService', () => {

  it('should be created', () => {
    const mockedHttpClient = mock<HttpClient>()
    const mockedHttpErrorService = mock<HttpErrorService>()
    const mockedEntityParser = mock<EntityParserService>()
    expect(new HttpBasicRundownService(instance(mockedHttpClient), instance(mockedHttpErrorService), instance(mockedEntityParser))).toBeTruthy();
  });
});
