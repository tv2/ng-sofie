import {Observable} from 'rxjs';
import {BasicRundown} from "../models/basic-rundown";

export interface RundownPlaylistServiceInterface {
  fetchBasicRundowns(): Observable<BasicRundown[]>
}
