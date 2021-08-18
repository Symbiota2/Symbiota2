import { Inject, Injectable } from '@nestjs/common';
import {
    Collection,
    CollectionCategoryLink, CollectionStat, Occurrence, TaxaEnumTreeEntry, Taxon
} from '@symbiota2/api-database';
import { DeepPartial, Repository } from 'typeorm';
import { CollectionFindAllParams } from './dto/coll-find-all.input.dto';
import { BaseService } from '@symbiota2/api-common';

/**
 * Service for manipulating specimen collections
 */
@Injectable()
export class CollectionService extends BaseService<Collection> {
    constructor(
        @Inject(Collection.PROVIDER_ID)
        private readonly collections: Repository<Collection>,
        @Inject(CollectionCategoryLink.PROVIDER_ID)
        private readonly categoryLinks: Repository<CollectionCategoryLink>,
        @Inject(CollectionStat.PROVIDER_ID)
        private readonly collectionStats: Repository<CollectionStat>,
        @Inject(Occurrence.PROVIDER_ID)
        private readonly occurrenceRepo: Repository<Occurrence>) {

        super(collections);
    }

    async findByID(id: number): Promise<Collection> {
        const collection = await this.collections.findOne(id, { relations: ['institution', 'collectionStats'] });
        if (!collection) {
            return null;
        }
        return collection;
    }

    /**
     * Queries for a list of collections
     * @param params Filter parameters for the query
     * @return Collection[] The list of collections; TODO: Why doesn't it return CollectionListItem[]?
     */
    async findAll(params?: CollectionFindAllParams): Promise<Collection[]> {
        const { orderBy, ...qParams } = params;

        return this.collections.find({
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
    async findByCategory(categoryID: number): Promise<Collection[]> {
        // This is too slow without using query builder to filter out fields
        const links = await this.categoryLinks.createQueryBuilder('l')
            .select()
            .where({ categoryID })
            .leftJoin('l.collection', 'collection')
            .orderBy('collection.collectionName', 'ASC')
            .getMany();
        return Promise.all(links.map(async (l) => await l.collection));
    }

    /**
     * Retrieves the list of collections that are not associated with any
     * category
     * @return CollectionListItem[] The list of uncategoried collections
     */
    async findUncategorized(): Promise<Collection[]> {
        const subquery = await this.categoryLinks.createQueryBuilder('l')
            .select(['l.collectionID'])
            .distinct(true);

        const collections = await this.collections.createQueryBuilder('c')
            .select()
            .where(`c.id not in (${subquery.getQuery()})`)
            .orderBy('c.collectionName', 'ASC')
            .getMany();

        return collections;
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
            await this.updateLastModified(id);
            return this.findByID(id);
        }
        return null;
    }

    /**
     * Updates the
     */
    async updateLastModified(id: number): Promise<void> {
        await this.collectionStats.update(id, {
            lastModifiedTimestamp: new Date()
        });
    }

    // TODO: Finish this
    async updateStats(id: number): Promise<boolean> {
        // TODO: How to do georeferencedCount?
        const counts = await this.occurrenceRepo.createQueryBuilder('c')
            .select([
                'COUNT(*) as recordCount',
                'COUNT(DISTINCT family) as familyCount',
                'COUNT(DISTINCT genus) as genusCount',
                'COUNT(DISTINCT scientificName) as speciesCount',
            ])
            .where({ collectionID: id })
            .execute();

        const stats = await this.collectionStats.findOne({ collectionID: id });
        if (!stats) {
            return false;
        }

        await this.collectionStats.save({ ...stats, ...counts });
        return true;
    }
}
