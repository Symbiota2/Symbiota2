import { Test, TestingModule } from '@nestjs/testing'
import { TaxonDescriptionStatementController } from './taxonDescriptionStatement.controller'

describe('TaxonDescriptionStatementController', () => {
  let controller: TaxonDescriptionStatementController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaxonDescriptionStatementController],
    }).compile()

    controller = module.get<TaxonDescriptionStatementController>(TaxonDescriptionStatementController)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined()
  });
});
