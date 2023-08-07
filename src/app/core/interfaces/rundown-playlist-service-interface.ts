import {Observable} from 'rxjs';
import {Identifier} from '../models/identifier';

export interface RundownPlaylistServiceInterface {
  fetchRundownPlaylistIdentifiers(): Observable<Identifier[]>
}
