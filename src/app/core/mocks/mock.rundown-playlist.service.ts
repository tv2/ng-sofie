import {RundownPlaylistServiceInterface} from '../interfaces/rundown-playlist-service-interface';
import {Observable, of} from 'rxjs';
import {Identifier} from '../models/identifier';

export class MockRundownPlaylistService implements RundownPlaylistServiceInterface {

  fetchRundownPlaylistIdentifiers(): Observable<Identifier[]> {
    return of(
      [
        {
          id: 'R-1',
          name: 'Rundown One'
        },
        {
          id: 'R-2',
          name: 'Rundown Two'
        }
      ]
    )
  }
}
