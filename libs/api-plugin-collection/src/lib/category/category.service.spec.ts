import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { AppConfigModule } from '@symbiota2/api-config';
import { AuthModule } from '@symbiota2/api-auth';
import { InstitutionModule } from '../institution';
import { DatabaseModule } from '@symbiota2/api-database';
import { CollectionService } from '@symbiota2/api-plugin-collection';
import { CategoryController } from './category.controller';
import { CollectionController } from '../collection.controller';

describe('CategoryService', () => {
  let service: CategoryService;

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

    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
