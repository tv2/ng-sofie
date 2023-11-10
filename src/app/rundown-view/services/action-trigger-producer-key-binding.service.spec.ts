import { TestBed } from '@angular/core/testing';

import { ActionTriggerProducerKeyBindingService } from './action-trigger-producer-key-binding.service';

describe('ActionTriggerProducerKeyBindingService', () => {
  let service: ActionTriggerProducerKeyBindingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionTriggerProducerKeyBindingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
