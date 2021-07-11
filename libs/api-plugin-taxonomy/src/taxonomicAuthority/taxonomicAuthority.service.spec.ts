import { Test, TestingModule } from '@nestjs/testing';
import { TaxonomicAuthorityService } from './taxonomicAuthority.service';

describe('TaxonomicAuthorityService', () => {
  let service: TaxonomicAuthorityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxonomicAuthorityService],
    }).compile();

    service = module.get<TaxonomicAuthorityService>(TaxonomicAuthorityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
