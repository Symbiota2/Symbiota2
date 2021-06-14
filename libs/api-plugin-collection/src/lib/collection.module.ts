import { Module } from '@nestjs/common';
import { DatabaseModule } from '@symbiota2/api-database';
import { CollectionService } from './collection.service';
import { CategoryService } from './category/category.service';
import { CollectionController } from './collection.controller';
import { CategoryController } from './category/category.controller';
import { InstitutionModule } from './institution/institution.module';
import { SymbiotaApiPlugin } from '@symbiota2/api-common';
import { AuthModule } from '@symbiota2/api-auth';
import { AppConfigModule } from '@symbiota2/api-config';

/**
 * Module for working with specimen collections
 */
@Module({
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
    exports: [
        CategoryService,
        CollectionService
    ]
})
export class CollectionModule extends SymbiotaApiPlugin {}
