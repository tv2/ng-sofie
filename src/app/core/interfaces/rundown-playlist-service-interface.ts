import {Observable} from 'rxjs';
import {BasicRundown} from "../models/BasicRundown";

export interface RundownPlaylistServiceInterface {
  fetchBasicRundowns(): Observable<BasicRundown[]>
}
