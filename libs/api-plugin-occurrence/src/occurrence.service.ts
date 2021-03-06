import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Occurrence } from '@symbiota2/api-database';
import { DeepPartial, Repository } from 'typeorm';
import { FindAllParams } from './dto/find-all-input.dto';
import {
    ApiCollectionListItem, ApiOccurrence,
    ApiTaxonSearchCriterion
} from '@symbiota2/data-access';
import { Geometry } from 'wkx';

type _OccurrenceFindAllItem = Pick<Occurrence, 'id' | 'catalogNumber' | 'taxonID' | 'sciname' | 'latitude' | 'longitude'>;
type OccurrenceFindAllItem = _OccurrenceFindAllItem & { collection: ApiCollectionListItem };

type OccurrenceFindAllList = {
    count: number;
    data: OccurrenceFindAllItem[];
}

/**
 * Service for retrieving occurrence records from the database
 */
@Injectable()
export class OccurrenceService {
    constructor(
        @Inject(Occurrence.PROVIDER_ID)
        private readonly occurrenceRepo: Repository<Occurrence>) { }

    /**
     * Retrieves a list of occurrence records
     * @param findAllOpts Filter options for the query
     * @return OccurrenceFindAllList A subset of the list of occurrences determined
     * by limit and offset, and a count of all occurrences matching the query
     */
    async findAll(findAllOpts: FindAllParams): Promise<OccurrenceFindAllList> {
        const { limit, offset, ...params } = findAllOpts;
        let qb = this.occurrenceRepo.createQueryBuilder('o')
            .select([
                'o.id',
                'o.catalogNumber',
                'o.taxonID',
                'o.sciname',
                'o.latitude',
                'o.longitude',
                'c.id',
                'c.collectionName',
                'c.icon'
            ])
            .innerJoin('o.collection', 'c')
            .limit(limit)
            .offset(offset);

        if (findAllOpts.collectionID) {
            if (Array.isArray(findAllOpts.collectionID)) {
                qb = qb.where('o.collectionID IN (:...collectionID)', { collectionID: params.collectionID });
            }
            else {
                qb = qb.where('o.collectionID = :collectionID', { collectionID: params.collectionID });
            }
        }

        if (findAllOpts.taxonSearchCriterion && findAllOpts.taxonSearchStr) {
            const searchStr = `${ findAllOpts.taxonSearchStr }%`;
            switch (findAllOpts.taxonSearchCriterion) {
                case ApiTaxonSearchCriterion.familyOrSciName:
                    qb.andWhere(
                        '(o.sciname LIKE :sciNameOrFamily or o.family LIKE :sciNameOrFamily)',
                        { sciNameOrFamily: searchStr }
                    );
                    break;
                case ApiTaxonSearchCriterion.sciName:
                    qb.andWhere(
                        'o.sciname LIKE :sciname',
                        { sciname: searchStr }
                    );
                    break;
                case ApiTaxonSearchCriterion.family:
                    qb.andWhere(
                        'o.family LIKE :family',
                        { family: searchStr }
                    );
                    break;
                case ApiTaxonSearchCriterion.higherTaxonomy:
                    // TODO: Taxon plugin returns children of higher taxonomy?
                    break;
                case ApiTaxonSearchCriterion.commonName:
                    // TODO: Taxon plugin returns common names for a taxon?
                    break;
                default:
                    break;
            }
        }

        if (findAllOpts.minimumElevationInMeters !== undefined) {
            qb.andWhere(
                'o.minimumElevationInMeters = :minElevation',
                { minElevation: findAllOpts.minimumElevationInMeters }
            );
        }

        if (findAllOpts.maximumElevationInMeters !== undefined) {
            qb.andWhere(
                'o.maximumElevationInMeters = :maxElevation',
                { maxElevation: findAllOpts.maximumElevationInMeters }
            );
        }

        if (findAllOpts.minLatitude !== undefined) {
            qb.andWhere(
                'o.latitude >= :minLat',
                { minLat: findAllOpts.minLatitude }
            )
        }

        if (findAllOpts.minLongitude !== undefined) {
            qb.andWhere(
                'o.longitude >= :minLon',
                { minLon: findAllOpts.minLongitude }
            )
        }

        if (findAllOpts.maxLatitude !== undefined) {
            qb.andWhere(
                'o.latitude <= :maxLat',
                { maxLat: findAllOpts.maxLatitude }
            )
        }

        if (findAllOpts.maxLongitude !== undefined) {
            qb.andWhere(
                'o.longitude <= :maxLon',
                { maxLon: findAllOpts.maxLongitude }
            )
        }

        const remainingLocalityKeys = [
            'country',
            'county',
            'locality',
            'stateProvince',
        ];

        for (const searchKey of remainingLocalityKeys) {
            if (findAllOpts[searchKey]) {
                qb.andWhere(`o.${searchKey} IS NOT NULL`);
                qb.andWhere(
                    `o.${ searchKey } LIKE :searchStr`,
                    { searchStr: `${ findAllOpts[searchKey] }%` }
                );
            }
        }

        if (findAllOpts.collectorLastName) {
            qb.andWhere('o.recordedBy IS NOT NULL')
            qb.andWhere(
                `o.recordedBy LIKE :collectorLastName`,
                { collectorLastName: `%${findAllOpts.collectorLastName}%` }
            )
        }

        if (findAllOpts.minEventDate) {
            qb.andWhere(`o.eventDate IS NOT NULL`)
            qb.andWhere(
                `o.eventDate >= :minEventDate`,
                { minEventDate: findAllOpts.minEventDate }
            );
        }

        if (findAllOpts.maxEventDate) {
            qb.andWhere(`o.eventDate IS NOT NULL`)
            qb.andWhere(
                `o.eventDate <= :maxEventDate`,
                { maxEventDate: findAllOpts.maxEventDate }
            );
        }

        if (findAllOpts.catalogNumber) {
            qb.andWhere(`o.catalogNumber IS NOT NULL`)
            qb.andWhere(
                `o.catalogNumber LIKE :catalogNumber`,
                { catalogNumber: `${findAllOpts.catalogNumber}%` }
            )
        }

        if (findAllOpts.limitToSpecimens === true) {
            qb.andWhere('o.basisOfRecord = "PreservedSpecimen"');
        }

        if (findAllOpts.limitToGenetic === true) {
            qb.andWhere('(select count(*) from omoccurgenetic g where g.occid = o.id) > 0');
        }

        if (findAllOpts.limitToImages === true) {
            qb.andWhere('(select count(*) from images i where i.occid = o.id) > 0');
        }

        if (findAllOpts.geoJSON) {
            let poly;
            const geojsonStr = Buffer.from(findAllOpts.geoJSON, 'base64');

            try {
                const geojson = JSON.parse(geojsonStr.toString('utf-8'));
                poly = Geometry.parseGeoJSON(geojson).toWkt();
            }
            catch (e) {
                throw new BadRequestException(`Invalid GeoJSON: ${e.toString()}`);
            }

            const searchPolyAsWKB = `PolyFromText('${poly}')`;
            const occurrenceAsPoint = "Point(o.longitude, o.latitude)";

            qb = qb.andWhere(`ST_CONTAINS(${searchPolyAsWKB}, ${occurrenceAsPoint})`);
        }

        // TODO: Make this a query param
        qb.addOrderBy('o.id', 'ASC');

        const [data, count] = await qb.getManyAndCount();
        return {
            count,
            data: await Promise.all(
                data.map(async (occurrence) => {
                    const { collection, ...props } = occurrence;
                    return {
                        ...props,
                        collection: await collection
                    }
                })
            )
        };
    }

    /**
     * Retrieves a specific occurrence by ID
     * @param id The occurrence ID
     * @return ApiOccurrence The occurrence record
     */
    async findByID(id: number): Promise<ApiOccurrence> {
        const { collection, ...props } = await this.occurrenceRepo.findOne(
            { id },
            { relations: ['collection'] }
        );
        return {
            collection: await collection,
            ...props
        }
    }

    /**
     * Creates a new occurrence record
     * @param collectionID The collection in which the occurrence should be created
     * @param occurrenceData The occurrence fields
     * @return ApiOccurrence The created occurrence
     */
    async create(collectionID: number, occurrenceData: DeepPartial<Occurrence>): Promise<ApiOccurrence> {
        const occurrence = this.occurrenceRepo.create({ collectionID, ...occurrenceData });
        const { collection, ...props } = await this.occurrenceRepo.save(occurrence);
        return {
            collection: await collection,
            ...props
        };
    }

    /**
     * Creates a list of occurrences
     * @param collectionID The collection to which the occurrences should be added
     * @param occurrenceData The list of occurrences
     */
    async createMany(collectionID: number, occurrenceData: DeepPartial<Occurrence>[]): Promise<void> {
        const occurrences = occurrenceData.map((o) => {
            return { ...o, collectionID };
        });

        await this.occurrenceRepo.createQueryBuilder()
            .insert()
            .values(occurrences)
            .execute();
    }
}
