import { TestBed } from '@angular/core/testing';

import { CollectionProfileService } from './collection-profile.service';

describe('CollectionProfileLinkService', () => {
  let service: CollectionProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollectionProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
