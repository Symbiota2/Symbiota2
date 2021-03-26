import { Test, TestingModule } from '@nestjs/testing';
import { InstitutionService } from './institution.service';
import { DatabaseModule } from '@symbiota2/api-database';
import { InstitutionController } from './institution.controller';

describe('InstitutionService', () => {
  let service: InstitutionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        imports: [DatabaseModule],
        providers: [InstitutionService],
        controllers: [InstitutionController]
    }).compile();

    service = module.get<InstitutionService>(InstitutionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
