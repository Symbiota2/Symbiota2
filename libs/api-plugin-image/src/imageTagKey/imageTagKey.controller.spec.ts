import { Test, TestingModule } from '@nestjs/testing'
import { ImageTagKeyController } from './imageTagKey.controller'

describe('ImageTagKeyController', () => {
  let controller: ImageTagKeyController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageTagKeyController],
    }).compile()

    controller = module.get<ImageTagKeyController>(ImageTagKeyController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
