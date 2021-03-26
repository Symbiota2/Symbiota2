import { Test, TestingModule } from '@nestjs/testing';
import { InstitutionController } from './institution.controller';
import { DatabaseModule } from '@symbiota2/api-database';
import { InstitutionService } from '@symbiota2/api-plugin-collection';

describe('InstitutionController', () => {
  let controller: InstitutionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        imports: [DatabaseModule],
        providers: [InstitutionService],
        controllers: [InstitutionController]
    }).compile();

    controller = module.get<InstitutionController>(InstitutionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
