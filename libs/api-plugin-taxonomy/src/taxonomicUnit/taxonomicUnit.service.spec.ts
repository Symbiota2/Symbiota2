import { Test, TestingModule } from '@nestjs/testing';
import { TaxonomicUnitService } from './taxonomicUnit.service';

describe('TaxonomicUnitService', () => {
  let service: TaxonomicUnitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxonomicUnitService],
    }).compile();

    service = module.get<TaxonomicUnitService>(TaxonomicUnitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
