import { RundownService } from './rundown.service';
import { HttpErrorService } from './http-error.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { HttpClient } from '@angular/common/http'

describe('RundownService', () => {
  it('should be created', () => {
    const mockedHttpClient = mock<HttpClient>()
    const mockedHttpErrorService = mock<HttpErrorService>()
    expect(new RundownService(instance(mockedHttpClient), instance(mockedHttpErrorService))).toBeTruthy();
  });
});
