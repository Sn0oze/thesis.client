import { TestBed } from '@angular/core/testing';

import { OptionsWheelService } from './options-wheel.service';

describe('OptionsWheelService', () => {
  let service: OptionsWheelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OptionsWheelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
