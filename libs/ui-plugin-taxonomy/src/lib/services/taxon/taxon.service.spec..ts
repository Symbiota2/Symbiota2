import { TestBed } from '@angular/core/testing';

import { TaxonService } from './taxon.service';

describe('TaxonService', () => {
    let service: TaxonService

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TaxonService);
    })

    it('should be created', () => {
        expect(service).toBeTruthy();
    })
})
