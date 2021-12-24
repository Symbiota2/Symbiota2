import { TestBed } from '@angular/core/testing'
import { ImageTagKeyService } from './imageTagKey.service'

describe('ImageTagKeyService', () => {
    let service: ImageTagKeyService

    beforeEach(() => {
        TestBed.configureTestingModule({})
        service = TestBed.inject(ImageTagKeyService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
