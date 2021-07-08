import { Test, TestingModule } from '@nestjs/testing'
import { TaxonDescriptionBlockService } from './taxonDescriptionBlock.service'

describe('TaxonDescriptionBlockService', () => {
  let service: TaxonDescriptionBlockService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxonDescriptionBlockService],
    }).compile()

    service = module.get<TaxonDescriptionBlockService>(TaxonDescriptionBlockService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
