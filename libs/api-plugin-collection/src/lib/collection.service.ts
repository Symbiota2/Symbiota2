import { Inject, Injectable } from '@nestjs/common';
import {
    Collection,
    CollectionCategoryLink
} from '@symbiota2/api-database';
import { DeepPartial, Repository } from 'typeorm';
import { CollectionFindAllParams } from './dto/coll-find-all.input.dto';
import { BaseService } from '@symbiota2/api-common';
import { CollectionListItem } from './dto/CollectionListItem.output.dto';

/**
 * Service for manipulating specimen collections
 */
@Injectable()
export class CollectionService extends BaseService<Collection> {
    constructor(
        @Inject(Collection.PROVIDER_ID)
        private readonly collections: Repository<Collection>,
        @Inject(CollectionCategoryLink.PROVIDER_ID)
        private readonly categoryLinks: Repository<CollectionCategoryLink>) {

        super(collections);
    }

    /**
     * Queries for a list of collections
     * @param params Filter parameters for the query
     * @return Collection[] The list of collections; TODO: Why doesn't it return CollectionListItem[]?
     */
    async findAll(params?: CollectionFindAllParams): Promise<Collection[]> {
        const { orderBy, ...qParams } = params;

        return this.collections.find({
            select: ['id', 'icon', 'collectionName', 'email'],
            order: { [orderBy]: 'ASC' },
            where: qParams.id ? { id: qParams.id } : {}
        });
    }

    /**
     * Retrieves the list of collections with a given collection categoryID
     * @param categoryID The categoryID for the list of collections
     * @return CollectionListItem[] The list of collections for the given
     * categoryID
     */
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

    /**
     * Retrieves the list of collections that are not associated with any
     * category
     * @return CollectionListItem[] The list of uncategoried collections
     */
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

    /**
     * Creates a new collection
     * @param data Field values for the new collection
     * @return Collection The new collection entity
     */
    async create(data: DeepPartial<Collection>): Promise<Collection> {
        const collection = this.collections.create(data);
        return this.collections.save(collection);
    }

    /**
     * Updates the collection with the given ID
     * @param id The collection ID
     * @param data The collection field values to update
     * @return Collection The updated collection
     */
    async updateByID(id: number, data: DeepPartial<Collection>): Promise<Collection> {
        const updateResult = await this.collections.update({ id }, data);
        if (updateResult.affected > 0) {
            return this.findByID(id);
        }
        return null;
    }
}
