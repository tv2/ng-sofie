import {RundownPlaylistServiceInterface} from '../interfaces/rundown-playlist-service-interface';
import {Observable, of} from 'rxjs';
import {BasicRundown} from "../models/BasicRundown";

export class MockRundownPlaylistService implements RundownPlaylistServiceInterface {

  fetchBasicRundowns(): Observable<BasicRundown[]> {
    return of(
      [
        {
          id: 'R-1',
          name: 'Rundown One',
          isActive: true,
          modifiedAt: 0
        },
        {
          id: 'R-2',
          name: 'Rundown Two',
          isActive: false,
          modifiedAt: 0
        }
      ]
    )
  }
}
