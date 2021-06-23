import { TestBed } from '@angular/core/testing';

import { TaxonService } from '../taxon/taxon.service';
import { TaxonomicEnumTreeService } from '@symbiota2/api-plugin-taxa';

describe('TaxonomicEnumTreeService', () => {
    let service: TaxonomicEnumTreeService

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TaxonomicEnumTreeService);
    })

    it('should be created', () => {
        expect(service).toBeTruthy();
    })
})
