import { Test, TestingModule } from '@nestjs/testing';
import { TaxonomicStatusController } from './taxonomicStatus.controller';

describe('TaxonomicStatusController', () => {
  let controller: TaxonomicStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaxonomicStatusController],
    }).compile();

    controller = module.get<TaxonomicStatusController>(TaxonomicStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
