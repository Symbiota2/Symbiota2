import { Test, TestingModule } from '@nestjs/testing';
import { TaxonVernacularController } from './taxonVernacular.controller';

describe('TaxaController', () => {
  let controller: TaxonVernacularController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaxonVernacularController],
    }).compile();

    controller = module.get<TaxonVernacularController>(TaxonVernacularController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
