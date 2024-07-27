import { TestBed } from '@angular/core/testing';

import { WheelActionService } from './wheel-action.service';

describe('WheelActionService', () => {
  let service: WheelActionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WheelActionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
