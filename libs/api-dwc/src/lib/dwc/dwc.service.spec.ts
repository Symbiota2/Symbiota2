import { Test, TestingModule } from '@nestjs/testing';
import { DwCService } from './dwc.service';

describe('ApiDwcService', () => {
  let service: DwCService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DwCService],
    }).compile();

    service = module.get<DwCService>(DwCService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
