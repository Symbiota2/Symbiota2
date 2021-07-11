import { TestBed } from '@angular/core/testing';

import { TaxonomicStatusService } from '@symbiota2/api-plugin-taxonomy';

describe('TaxonomicStatusService', () => {
    let service: TaxonomicStatusService

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TaxonomicStatusService);
    })

    it('should be created', () => {
        expect(service).toBeTruthy();
    })
})
