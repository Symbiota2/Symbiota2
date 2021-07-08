import { Test, TestingModule } from '@nestjs/testing'
import { TaxonLinkService } from './taxonLink.service'

describe('TaxonLinkService', () => {
  let service: TaxonLinkService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxonLinkService],
    }).compile()

    service = module.get<TaxonLinkService>(TaxonLinkService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
