import { TestBed } from '@angular/core/testing';

import { ContinentService } from './continent.service';

describe('ContinentService', () => {
  let service: ContinentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContinentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
