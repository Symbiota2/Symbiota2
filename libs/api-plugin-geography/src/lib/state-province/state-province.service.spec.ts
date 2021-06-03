import { Test, TestingModule } from '@nestjs/testing';
import { StateProvinceService } from './state-province.service';

describe('StateProvinceService', () => {
  let service: StateProvinceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StateProvinceService],
    }).compile();

    service = module.get<StateProvinceService>(StateProvinceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
