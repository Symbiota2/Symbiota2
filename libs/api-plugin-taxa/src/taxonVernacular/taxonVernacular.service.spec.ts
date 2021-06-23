import { Test, TestingModule } from '@nestjs/testing'
import { TaxonVernacularService } from './taxonVernacular.service'

describe('TaxonVernacularService', () => {
  let service: TaxonVernacularService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxonVernacularService],
    }).compile()

    service = module.get<TaxonVernacularService>(TaxonVernacularService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
