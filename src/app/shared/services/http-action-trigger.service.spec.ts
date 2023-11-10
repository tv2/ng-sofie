import { TestBed } from '@angular/core/testing';

import { HttpActionTriggerService } from './http-action-trigger.service';

describe('HttpActionTriggerService', () => {
  let service: HttpActionTriggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpActionTriggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
