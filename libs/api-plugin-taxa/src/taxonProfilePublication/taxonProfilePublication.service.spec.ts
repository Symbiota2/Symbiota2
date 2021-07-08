import { Test, TestingModule } from '@nestjs/testing'
import { TaxonProfilePublicationService } from './taxonProfilePublication.service'

describe('TaxonProfilePublicationService', () => {
  let service: TaxonProfilePublicationService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxonProfilePublicationService],
    }).compile()

    service = module.get<TaxonProfilePublicationService>(TaxonProfilePublicationService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
