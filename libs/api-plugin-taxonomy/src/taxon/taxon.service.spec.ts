import { Test, TestingModule } from '@nestjs/testing'
import { TaxonService } from './taxon.service'

describe('TaxaService', () => {
  let service: TaxonService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxonService],
    }).compile()

    service = module.get<TaxonService>(TaxonService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
