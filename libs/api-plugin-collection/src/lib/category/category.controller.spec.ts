import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { AppConfigModule } from '@symbiota2/api-config';
import { AuthModule } from '@symbiota2/api-auth';
import { InstitutionModule } from '../institution';
import { DatabaseModule } from '@symbiota2/api-database';
import {
    CategoryService,
    CollectionService
} from '@symbiota2/api-plugin-collection';
import { CollectionController } from '../collection.controller';

describe('CategoryController', () => {
  let controller: CategoryController;

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

    controller = module.get<CategoryController>(CategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
