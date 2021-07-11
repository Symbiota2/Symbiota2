import { Test, TestingModule } from '@nestjs/testing'
import { TaxonDescriptionBlockController } from '@symbiota2/api-plugin-taxa'

describe('TaxonDescriptionBlockController', () => {
  let controller: TaxonDescriptionBlockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaxonDescriptionBlockController],
    }).compile();

    controller = module.get<TaxonDescriptionBlockController>(TaxonDescriptionBlockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined()
  });
});
