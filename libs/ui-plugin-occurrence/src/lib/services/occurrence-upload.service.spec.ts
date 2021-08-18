import { TestBed } from '@angular/core/testing';

import { OccurrenceUploadService } from './occurrence-upload.service';

describe('OccurrenceUploadService', () => {
  let service: OccurrenceUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OccurrenceUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
