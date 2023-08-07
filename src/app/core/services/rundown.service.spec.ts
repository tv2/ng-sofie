import { TestBed } from '@angular/core/testing';

import { RundownService } from './rundown.service';

describe('RundownService', () => {
  let service: RundownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RundownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
