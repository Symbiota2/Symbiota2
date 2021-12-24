import { Test, TestingModule } from '@nestjs/testing'
import { ImageTagService } from './imageTag.service'

describe('ImageTagService', () => {
  let service: ImageTagService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageTagService],
    }).compile()

    service = module.get<ImageTagService>(ImageTagService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
