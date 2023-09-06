import {Observable} from 'rxjs';
import {Identifier} from '../models/identifier';

export abstract class AdLibPieceService {
  public abstract fetchAdLibPieceIdentifiers(rundownId: string): Observable<Identifier[]>
  public abstract executeAdLibPiece(rundownId: string, adLibIdentifier: Identifier): Observable<void>
}
