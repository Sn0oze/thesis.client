import { TestBed } from '@angular/core/testing';

import { CanvasSessionService } from './canvas-session.service';

describe('CanvasSessionService', () => {
  let service: CanvasSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanvasSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
