import {AdLibPieceServiceInterface} from '../interfaces/ad-lib-piece-service-interface';
import {Observable, of} from 'rxjs';
import {Identifier} from '../models/identifier';
import {AdLibPiece} from '../models/ad-lib-piece';
import {MockRundownEventService} from './mock.rundown-event.service';
import {RundownAdLibPieceInserted} from '../models/rundown-event';
import {RundownEventType} from '../models/rundown-event-type';
import {Injectable} from '@angular/core';
import {MockDataService} from './mock.data.service';

const AD_LIB_PIECES: AdLibPiece[] = [
  {
    id: 'adLibPieceOne',
    name: 'FirstAdLib',
    partId: '',
    layer: 'someLayer',
    duration: 5000,
    start: 0
  },
  {
    id: 'adLibPieceTwo',
    name: 'SecondAdLib',
    partId: '',
    layer: 'someLayer',
    duration: 10000,
    start: 0
  }
]

const AD_LIB_PIECE_IDENTIFIERS: Identifier[] = AD_LIB_PIECES.map(piece => ({
  id: piece.id,
  name: piece.name
}))

@Injectable()
export class MockAdLibPieceService implements AdLibPieceServiceInterface {

  constructor(
    private eventService: MockRundownEventService,
    private dataService: MockDataService
  ) { }

  public executeAdLibPiece(rundownId: string, adLibIdentifier: Identifier): Observable<void> {
    const adLibPiece: AdLibPiece = AD_LIB_PIECES.find(piece => piece.id === adLibIdentifier.id)!
    adLibPiece.start = new Date().getTime()
    this.eventService.doMockEvent({
      type: RundownEventType.AD_LIB_PIECE_INSERTED,
      adLibPiece: adLibPiece,
      rundownId,
      segmentId: this.dataService.currentSegment.id,
      partId: this.dataService.currentPart.id
    } as RundownAdLibPieceInserted)
    return of()
  }

  public fetchAdLibPieceIdentifiers(rundownId: string): Observable<Identifier[]> {
    return of(AD_LIB_PIECE_IDENTIFIERS)
  }
}
