import { HttpAdLibPieceService } from './http-ad-lib-piece.service';
import { HttpClient } from '@angular/common/http'
import { instance, mock } from '@typestrong/ts-mockito'
import { HttpErrorService } from './http-error.service'

describe('HttpAdLibPieceService', () => {
  it('should be created', () => {
    const mockedHttpClient = mock<HttpClient>()
    const mockedHttpErrorService = mock<HttpErrorService>()
    expect(new HttpAdLibPieceService(instance(mockedHttpClient), instance(mockedHttpErrorService))).toBeTruthy();
  });
});
