import { Inject, Injectable } from '@nestjs/common';
import {
    Collection,
    CollectionCategoryLink
} from '@symbiota2/api-database';
import { DeepPartial, Repository } from 'typeorm';
import { CollectionFindAllParams } from './dto/coll-find-all.input.dto';
import { BaseService } from '@symbiota2/api-common';
import { CollectionListItem } from './dto/CollectionListItem.output.dto';

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
        const { orderBy, ...qParams } = params;

        return this.collections.find({
            select: ['id', 'icon', 'collectionName', 'email'],
            order: { [orderBy]: 'ASC' },
            where: qParams.id ? { id: qParams.id } : {}
        });
    }

    async findByCategory(categoryID: number): Promise<CollectionListItem[]> {
        // This is too slow without using query builder to filter out fields
        const links = await this.categoryLinks.createQueryBuilder('l')
            .select(['l.categoryID', 'collection.id', 'collection.icon', 'collection.collectionName'])
            .where({ categoryID })
            .leftJoin('l.collection', 'collection')
            .orderBy('collection.collectionName', 'ASC')
            .getMany();
        return Promise.all(links.map(async (l) => new CollectionListItem(await l.collection)));
    }

    async findUncategorized(): Promise<CollectionListItem[]> {
        const subquery = await this.categoryLinks.createQueryBuilder('l')
            .select(['l.collectionID'])
            .distinct(true);

        const collections = await this.collections.createQueryBuilder('c')
            .select(['c.id', 'c.icon', 'c.collectionName'])
            .where(`c.id not in (${subquery.getQuery()})`)
            .orderBy('c.collectionName', 'ASC')
            .getMany();

        return collections.map((c) => new CollectionListItem(c));
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
