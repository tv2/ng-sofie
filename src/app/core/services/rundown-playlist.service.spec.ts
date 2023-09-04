import { RundownPlaylistService } from './rundown-playlist.service';
import { HttpClient } from '@angular/common/http'
import { HttpErrorService } from './http-error.service'
import { instance, mock } from '@typestrong/ts-mockito'

describe('RundownPlaylistService', () => {

  it('should be created', () => {
    const mockedHttpClient = mock<HttpClient>()
    const mockedHttpErrorService = mock<HttpErrorService>()
    expect(new RundownPlaylistService(instance(mockedHttpClient), instance(mockedHttpErrorService))).toBeTruthy();
  });
});
