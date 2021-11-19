import { TestBed } from '@angular/core/testing';

import { TaxonomicUnitService } from './taxonomicUnit.service';

describe('TaxonomicUnitService', () => {
    let service: TaxonomicUnitService

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TaxonomicUnitService);
    })

    it('should be created', () => {
        expect(service).toBeTruthy();
    })
})
