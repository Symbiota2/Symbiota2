import { Test, TestingModule } from '@nestjs/testing'
import { TaxonDescriptionStatementService } from './taxonDescriptionStatement.service'

describe('TaxonDescriptionStatementService', () => {
  let service: TaxonDescriptionStatementService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxonDescriptionStatementService],
    }).compile()

    service = module.get<TaxonDescriptionStatementService>(TaxonDescriptionStatementService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
