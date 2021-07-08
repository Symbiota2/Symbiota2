import { Test, TestingModule } from '@nestjs/testing'
import { TaxonProfilePublicationDescriptionLinkController } from './taxonProfilePublicationDescriptionLink.controller'
import { TaxonProfilePublicationDescriptionLink } from './dto/TaxonProfilePublicationDescriptionLink';

describe('TaxonProfilePublicationDescriptionLinkController', () => {
  let controller: TaxonProfilePublicationDescriptionLinkController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaxonProfilePublicationDescriptionLinkController],
    }).compile()

    controller = module.get<TaxonProfilePublicationDescriptionLinkController>(TaxonProfilePublicationDescriptionLinkController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
