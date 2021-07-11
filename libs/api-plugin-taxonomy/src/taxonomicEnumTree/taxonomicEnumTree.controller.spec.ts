import { Test, TestingModule } from '@nestjs/testing';
import { TaxonomicEnumTreeController } from './taxonomicEnumTree.controller';

describe('TaxonomicEnumTreeController', () => {
  let controller: TaxonomicEnumTreeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaxonomicEnumTreeController],
    }).compile();

    controller = module.get<TaxonomicEnumTreeController>(TaxonomicEnumTreeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
