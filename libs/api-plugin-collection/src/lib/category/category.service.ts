import { Inject, Injectable } from '@nestjs/common';
import {
    CollectionCategory, CollectionCategoryLink
} from '@symbiota2/api-database';
import { Repository } from 'typeorm';
import { BaseService } from '@symbiota2/api-common';

@Injectable()
export class CategoryService extends BaseService<CollectionCategory> {
    constructor(
        @Inject(CollectionCategory.PROVIDER_ID)
        private readonly categories: Repository<CollectionCategory>,
        @Inject(CollectionCategoryLink.PROVIDER_ID)
        private readonly collectionCategoryLinks: Repository<CollectionCategoryLink>) {

        super(categories);
    }

    async findAll(): Promise<CollectionCategory[]> {
        return this.categories.find({
            order: { category: 'ASC' }
        });
    }

    async addCollectionToCategory(categoryID: number, collectionID: number): Promise<CollectionCategory> {
        const newLink = this.collectionCategoryLinks.create({ collectionID, categoryID });
        await this.collectionCategoryLinks.save(newLink);
        return await this.categories.findOne({ id: categoryID });
    }

    async removeCollectionFromCategory(categoryID: number, collectionID: number): Promise<CollectionCategory> {
        await this.collectionCategoryLinks.delete({ categoryID, collectionID });
        return await this.categories.findOne({ id: categoryID });
    }
}
