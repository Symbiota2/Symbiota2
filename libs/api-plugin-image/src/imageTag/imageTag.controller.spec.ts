import { Test, TestingModule } from '@nestjs/testing'
import { ImageTagController } from './imageTag.controller'

describe('ImageTagController', () => {
  let controller: ImageTagController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageTagController],
    }).compile()

    controller = module.get<ImageTagController>(ImageTagController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
