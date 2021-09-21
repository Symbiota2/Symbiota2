import { Test, TestingModule } from '@nestjs/testing';
import { CollectionRolesController } from './collection-roles.controller';

describe('CollectionRolesController', () => {
  let controller: CollectionRolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollectionRolesController],
    }).compile();

    controller = module.get<CollectionRolesController>(CollectionRolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
