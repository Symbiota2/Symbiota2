import { TestBed } from '@angular/core/testing'
import { TaxonDescriptionStatementService } from './taxonDescriptionStatement.service'

describe('TaxonDescriptionStatementService', () => {
    let service: TaxonDescriptionStatementService

    beforeEach(() => {
        TestBed.configureTestingModule({})
        service = TestBed.inject(TaxonDescriptionStatementService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
