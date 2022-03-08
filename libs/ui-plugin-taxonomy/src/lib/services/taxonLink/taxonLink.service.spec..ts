import { TestBed } from '@angular/core/testing';

import { TaxonLinkService } from './taxonLink.service';

describe('TaxonLinkService', () => {
    let service: TaxonLinkService

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TaxonLinkService);
    })

    it('should be created', () => {
        expect(service).toBeTruthy();
    })
})
