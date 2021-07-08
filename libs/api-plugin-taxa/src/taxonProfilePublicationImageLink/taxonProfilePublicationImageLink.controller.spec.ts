import { Test, TestingModule } from '@nestjs/testing'
import { TaxonProfilePublicationImageLinkController } from './taxonProfilePublicationImageLink.controller'
import { TaxonProfilePublicationImageLink } from './dto/TaxonProfilePublicationImageLink';

describe('TaxonProfilePublicationImageLinkController', () => {
  let controller: TaxonProfilePublicationImageLinkController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaxonProfilePublicationImageLinkController],
    }).compile()

    controller = module.get<TaxonProfilePublicationImageLinkController>(TaxonProfilePublicationImageLinkController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
