import { Test, TestingModule } from '@nestjs/testing';
import { TaxonController } from './taxon.controller';

describe('TaxaController', () => {
  let controller: TaxonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaxonController],
    }).compile();

    controller = module.get<TaxonController>(TaxonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
