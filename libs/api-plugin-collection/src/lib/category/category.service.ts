import { Inject, Injectable } from '@nestjs/common';
import {
    CollectionCategory
} from '@symbiota2/api-database';
import { Repository } from 'typeorm';
import { BaseService } from '@symbiota2/api-common';

@Injectable()
export class CategoryService extends BaseService<CollectionCategory> {
    constructor(
        @Inject(CollectionCategory.PROVIDER_ID)
        private readonly categories: Repository<CollectionCategory>) {

        super(categories);
    }

    async findAll(): Promise<CollectionCategory[]> {
        return this.categories.find();
    }
}
