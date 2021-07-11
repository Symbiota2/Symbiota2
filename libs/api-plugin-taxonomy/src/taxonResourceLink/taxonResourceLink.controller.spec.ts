import { Test, TestingModule } from '@nestjs/testing';
import { TaxonResourceLinkController } from './taxonResourceLink.controller';

describe('TaxonResourceLinkController', () => {
  let controller: TaxonResourceLinkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaxonResourceLinkController],
    }).compile();

    controller = module.get<TaxonResourceLinkController>(TaxonResourceLinkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
