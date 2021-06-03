import { TestBed } from '@angular/core/testing';

import { StateProvinceService } from './state-province.service';

describe('StateProvinceService', () => {
  let service: StateProvinceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateProvinceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
