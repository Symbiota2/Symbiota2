import { TestBed } from '@angular/core/testing';

import { TaxonomyUploadService } from './taxonomy-upload.service';

describe('TaxonomyUploadService', () => {
  let service: TaxonomyUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaxonomyUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
