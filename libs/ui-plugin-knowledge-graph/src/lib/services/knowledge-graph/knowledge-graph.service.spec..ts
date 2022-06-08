import { TestBed } from '@angular/core/testing'
import { KnowledgeGraphService } from './knowledge-graph.service'

describe('KnowledgeGraphService', () => {
    let service: KnowledgeGraphService

    beforeEach(() => {
        TestBed.configureTestingModule({})
        service = TestBed.inject(KnowledgeGraphService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
