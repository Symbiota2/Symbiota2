import { Test, TestingModule } from '@nestjs/testing'
import { TaxonProfilePublicationDescriptionLinkService } from './taxonProfilePublicationDescriptionLink.service';

describe('TaxonProfilePublicationDescriptionLinkService', () => {
  let service: TaxonProfilePublicationDescriptionLinkService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxonProfilePublicationDescriptionLinkService],
    }).compile()

    service = module.get<TaxonProfilePublicationDescriptionLinkService>(TaxonProfilePublicationDescriptionLinkService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
