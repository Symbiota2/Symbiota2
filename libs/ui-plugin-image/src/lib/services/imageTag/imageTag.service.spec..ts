import { TestBed } from '@angular/core/testing'
import { ImageTagService } from './imageTag.service'

describe('ImageTagService', () => {
    let service: ImageTagService

    beforeEach(() => {
        TestBed.configureTestingModule({})
        service = TestBed.inject(ImageTagService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
