import { Test, TestingModule } from '@nestjs/testing';
import { CollectionController } from './collection.controller';
import { AppConfigModule } from '@symbiota2/api-config';
import { AuthModule } from '@symbiota2/api-auth';
import { InstitutionModule } from './institution';
import { DatabaseModule } from '@symbiota2/api-database';
import {
    CategoryService,
    CollectionService
} from '@symbiota2/api-plugin-collection';
import { CategoryController } from './category/category.controller';

describe('CollectionController', () => {
  let controller: CollectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        imports: [
            AppConfigModule,
            AuthModule,
            InstitutionModule,
            DatabaseModule
        ],
        providers: [
            CategoryService,
            CollectionService
        ],
        controllers: [
            CategoryController,
            CollectionController
        ],
    }).compile();

    controller = module.get<CollectionController>(CollectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
