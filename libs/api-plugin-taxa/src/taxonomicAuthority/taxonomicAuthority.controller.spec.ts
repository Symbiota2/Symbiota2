import { Test, TestingModule } from '@nestjs/testing';
import { TaxonomicAuthorityController } from './taxonomicAuthority.controller';

describe('TaxonomicAuthorityController', () => {
  let controller: TaxonomicAuthorityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaxonomicAuthorityController],
    }).compile();

    controller = module.get<TaxonomicAuthorityController>(TaxonomicAuthorityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
