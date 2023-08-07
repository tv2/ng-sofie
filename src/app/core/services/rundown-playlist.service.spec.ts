import { TestBed } from '@angular/core/testing';

import { RundownPlaylistService } from './rundown-playlist.service';

describe('RundownPlaylistService', () => {
  let service: RundownPlaylistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RundownPlaylistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
