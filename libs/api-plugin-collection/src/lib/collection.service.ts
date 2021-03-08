import { Inject, Injectable } from '@nestjs/common';
import {
    Collection,
    CollectionCategoryLink
} from '@symbiota2/api-database';
import { DeepPartial, Repository } from 'typeorm';
import { CollectionFindAllParams } from './dto/coll-find-all.input.dto';
import { BaseService } from '@symbiota2/api-common';

@Injectable()
export class CollectionService extends BaseService<Collection> {
    constructor(
        @Inject(Collection.PROVIDER_ID)
        private readonly collections: Repository<Collection>,
        @Inject(CollectionCategoryLink.PROVIDER_ID)
        private readonly categoryLinks: Repository<CollectionCategoryLink>) {

        super(collections);
    }

    async findAll(params?: CollectionFindAllParams): Promise<Collection[]> {
        const { limit, offset, ...qParams } = params;

        const query = this.collections.createQueryBuilder()
            .select()
            .take(limit)
            .skip(offset);

        if (qParams.id) {
            query.whereInIds(qParams.id);
        }

        return query.getMany();
    }

    async findByCategory(categoryID: number): Promise<Collection[]> {
        const links = await this.categoryLinks.find({ categoryID });
        return Promise.all(links.map(async (l) => l.collection));
    }

    async create(data: DeepPartial<Collection>): Promise<Collection> {
        const collection = this.collections.create(data);
        return this.collections.save(collection);
    }

    async updateByID(id: number, data: DeepPartial<Collection>): Promise<Collection> {
        const updateResult = await this.collections.update({ id }, data);
        if (updateResult.affected > 0) {
            return this.findByID(id);
        }
        return null;
    }
}
