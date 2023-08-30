import { AdLibPieceService } from './ad-lib-piece.service';
import { HttpClient } from '@angular/common/http'
import { instance, mock } from '@typestrong/ts-mockito'
import { HttpErrorService } from './http-error.service'

describe('AdLibPieceService', () => {
  it('should be created', () => {
    const mockedHttpClient = mock<HttpClient>()
    const mockedHttpErrorService = mock<HttpErrorService>()
    expect(new AdLibPieceService(instance(mockedHttpClient), instance(mockedHttpErrorService))).toBeTruthy();
  });
});
