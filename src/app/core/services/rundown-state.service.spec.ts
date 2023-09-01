import { TestBed } from '@angular/core/testing';

import { RundownStateService } from './rundown-state.service';

describe('RundownStateService', () => {
  let service: RundownStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RundownStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
