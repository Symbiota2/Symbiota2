import { Test, TestingModule } from '@nestjs/testing';
import { TaxonomicUnitController } from './taxonomicUnit.controller';

describe('TaxonomicUnitController', () => {
  let controller: TaxonomicUnitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaxonomicUnitController],
    }).compile();

    controller = module.get<TaxonomicUnitController>(TaxonomicUnitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
