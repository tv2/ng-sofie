import {BasicRundownService} from '../interfaces/basic-rundown-service';
import {Observable, of} from 'rxjs';
import {BasicRundown} from "../models/basic-rundown";

export class MockRundownPlaylistService implements BasicRundownService {

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
