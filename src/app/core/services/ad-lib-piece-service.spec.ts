import { TestBed } from '@angular/core/testing';

import { AdLibPieceService } from './ad-lib-piece.service';

describe('AdLibPieceServiceService', () => {
  let service: AdLibPieceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdLibPieceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
