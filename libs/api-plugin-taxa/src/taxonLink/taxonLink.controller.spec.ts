import { Test, TestingModule } from '@nestjs/testing'
import { TaxonLinkController } from './taxonLink.controller'

describe('TaxonLinkController', () => {
  let controller: TaxonLinkController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaxonLinkController],
    }).compile()

    controller = module.get<TaxonLinkController>(TaxonLinkController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
