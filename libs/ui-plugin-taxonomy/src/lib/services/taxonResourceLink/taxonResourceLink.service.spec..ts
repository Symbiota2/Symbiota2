import { TestBed } from '@angular/core/testing';

import { TaxonResourceLinkService } from './taxonResourceLink.service';

describe('TaxonResourceLinkService', () => {
    let service: TaxonResourceLinkService

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TaxonResourceLinkService);
    })

    it('should be created', () => {
        expect(service).toBeTruthy();
    })
})
