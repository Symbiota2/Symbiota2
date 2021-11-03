import { Test, TestingModule } from '@nestjs/testing';
import { JwtKeyService } from './jwt-key.service';

describe('JwtKeyService', () => {
  let service: JwtKeyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtKeyService],
    }).compile();

    service = module.get<JwtKeyService>(JwtKeyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
