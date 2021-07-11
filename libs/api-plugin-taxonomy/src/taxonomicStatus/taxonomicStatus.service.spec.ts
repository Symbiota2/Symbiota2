import { Test, TestingModule } from '@nestjs/testing';
import { TaxonomicStatusService } from './taxonomicStatus.service';

describe('TaxonomicStatusService', () => {
  let service: TaxonomicStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxonomicStatusService],
    }).compile();

    service = module.get<TaxonomicStatusService>(TaxonomicStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
