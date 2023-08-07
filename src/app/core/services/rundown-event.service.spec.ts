import { TestBed } from '@angular/core/testing';

import { RundownEventService } from './rundown-event.service';

describe('RundownEventService', () => {
  let service: RundownEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RundownEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
