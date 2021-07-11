import { TestBed } from '@angular/core/testing'
import { TaxonDescriptionBlockService } from './taxonDescriptionBlock.service'

describe('TaxonDescriptionBlockService', () => {
    let service: TaxonDescriptionBlockService

    beforeEach(() => {
        TestBed.configureTestingModule({})
        service = TestBed.inject(TaxonDescriptionBlockService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
