import { Test, TestingModule } from '@nestjs/testing';
import { CollectionService } from './collection.service';
import { AppConfigModule } from '@symbiota2/api-config';
import { AuthModule } from '@symbiota2/api-auth';
import { InstitutionModule } from './institution';
import { DatabaseModule } from '@symbiota2/api-database';
import { CategoryService } from '@symbiota2/api-plugin-collection';
import { CategoryController } from './category/category.controller';
import { CollectionController } from './collection.controller';

describe('CollectionService', () => {
  let service: CollectionService;

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

    service = module.get<CollectionService>(CollectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
