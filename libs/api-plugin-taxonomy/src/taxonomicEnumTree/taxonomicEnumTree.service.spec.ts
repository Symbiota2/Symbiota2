import { Test, TestingModule } from '@nestjs/testing';
import { TaxonomicEnumTreeService } from './taxonomicEnumTree.service';

describe('TaxonomicAuthorityService', () => {
  let service: TaxonomicEnumTreeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxonomicEnumTreeService],
    }).compile();

    service = module.get<TaxonomicEnumTreeService>(TaxonomicEnumTreeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
