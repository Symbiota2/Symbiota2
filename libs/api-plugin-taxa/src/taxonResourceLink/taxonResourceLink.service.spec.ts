import { Test, TestingModule } from '@nestjs/testing'
import { TaxonResourceLinkService } from './taxonResourceLink.service'

describe('TaxonResourceLinkService', () => {
  let service: TaxonResourceLinkService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxonResourceLinkService],
    }).compile()

    service = module.get<TaxonResourceLinkService>(TaxonResourceLinkService)
  });

  it('should be defined', () => {
    expect(service).toBeDefined()
  });
});
