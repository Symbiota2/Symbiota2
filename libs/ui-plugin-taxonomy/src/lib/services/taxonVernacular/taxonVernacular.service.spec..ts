import { TestBed } from '@angular/core/testing';

import { TaxonVernacularService } from './taxonVernacular.service';

describe('TaxonService', () => {
    let service: TaxonVernacularService

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TaxonVernacularService);
    })

    it('should be created', () => {
        expect(service).toBeTruthy();
    })
})
