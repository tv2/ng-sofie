import {Observable} from 'rxjs';
import {Identifier} from '../models/identifier';

export interface AdLibPieceServiceInterface {

  fetchAdLibPieceIdentifiers(rundownId: string): Observable<Identifier[]>

  executeAdLibPiece(rundownId: string, adLibIdentifier: Identifier): Observable<void>
}
