import { Test, TestingModule } from '@nestjs/testing'
import { TaxonProfilePublicationImageLinkService } from './taxonProfilePublicationImageLink.service'

describe('TaxonProfilePublicationImageLinkService', () => {
  let service: TaxonProfilePublicationImageLinkService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxonProfilePublicationImageLinkService],
    }).compile()

    service = module.get<TaxonProfilePublicationImageLinkService>(TaxonProfilePublicationImageLinkService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
