import { Test, TestingModule } from '@nestjs/testing'
import { TaxonProfilePublicationController } from './taxonProfilePublication.controller'
import { TaxonProfilePublication } from './dto/TaxonProfilePublication';

describe('TaxonProfilePublicationController', () => {
  let controller: TaxonProfilePublicationController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaxonProfilePublicationController],
    }).compile()

    controller = module.get<TaxonProfilePublicationController>(TaxonProfilePublicationController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
