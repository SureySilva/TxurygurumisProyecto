import { TestBed } from '@angular/core/testing';

import { PatternsService } from './patterns.service';

describe('PatternsService', () => {
  let service: PatternsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatternsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
