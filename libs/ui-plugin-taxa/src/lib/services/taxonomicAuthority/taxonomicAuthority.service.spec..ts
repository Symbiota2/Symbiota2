import { TestBed } from '@angular/core/testing';

import { TaxonomicAuthorityService } from './taxonomicAuthority.service';

describe('TaxonService', () => {
    let service: TaxonomicAuthorityService

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TaxonomicAuthorityService);
    })

    it('should be created', () => {
        expect(service).toBeTruthy();
    })
})
