import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
    Occurrence,
    OccurrenceUploadFieldMap,
    Taxon
} from '@symbiota2/api-database';
import {
    DeepPartial,
    FindConditions,
    FindManyOptions, IsNull, Not,
    Repository
} from 'typeorm';
import { FindAllParams } from './dto/find-all-input.dto';
import {
    ApiCollectionListItem, ApiOccurrence,
    ApiTaxonSearchCriterion
} from '@symbiota2/data-access';
import { Geometry } from 'wkx';
import { InjectQueue } from '@nestjs/bull';
import { QUEUE_ID_OCCURRENCE_UPLOAD_CLEANUP } from '../queues/occurrence-upload-cleanup.queue';
import { Queue } from 'bull';
import { OccurrenceUploadCleanupJob } from '../queues/occurrence-upload-cleanup.processor';
import { OccurrenceUpload } from '@symbiota2/api-database';
import { QUEUE_ID_OCCURRENCE_UPLOAD } from '../queues/occurrence-upload.queue';
import { OccurrenceUploadJob } from '../queues/occurrence-upload.processor';
import { csvIterator } from '@symbiota2/api-common';
import { DwcArchiveBuilder, dwcRecordType } from '@symbiota2/dwc';
import { v4 as uuid4 } from 'uuid';
import { join as pathJoin } from 'path';

type _OccurrenceFindAllItem = Pick<Occurrence, 'id' | 'catalogNumber' | 'taxonID' | 'scientificName' | 'latitude' | 'longitude'>;
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
    private static readonly DWCA_CREATE_LIMIT = 1024;

    constructor(
        @Inject(Occurrence.PROVIDER_ID)
        private readonly occurrenceRepo: Repository<Occurrence>,
        @Inject(OccurrenceUpload.PROVIDER_ID)
        private readonly uploadRepo: Repository<OccurrenceUpload>,
        @InjectQueue(QUEUE_ID_OCCURRENCE_UPLOAD_CLEANUP)
        private readonly uploadCleanupQueue: Queue<OccurrenceUploadCleanupJob>,
        @InjectQueue(QUEUE_ID_OCCURRENCE_UPLOAD)
        private readonly uploadQueue: Queue<OccurrenceUploadJob>) { }

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
                'o.scientificName',
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
                        '(o.scientificName LIKE :sciNameOrFamily or o.family LIKE :sciNameOrFamily)',
                        { sciNameOrFamily: searchStr }
                    );
                    break;
                case ApiTaxonSearchCriterion.scientificName:
                    qb.andWhere(
                        'o.scientificName LIKE :scientificName',
                        { scientificName: searchStr }
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
        if (!Number.isInteger(id)) {
            throw new BadRequestException('ID must be an integer');
        }

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

    /**
     * Returns a list of the fields of the occurrence entity
     */
    getOccurrenceFields(): string[] {
        const entityColumns = this.occurrenceRepo.metadata.columns;
        return entityColumns.map((c) => c.propertyName);
    }

    /**
     * Creates a new upload in the database
     * @param filePath The path to the file containing occurrences
     * @param mimeType The mimeType of the file
     * @param fieldMap Object describing how upload fields map to the occurrence database
     */
    async createUpload(filePath: string, mimeType: string, fieldMap: OccurrenceUploadFieldMap): Promise<OccurrenceUpload> {
        let upload = this.uploadRepo.create({ filePath, mimeType, fieldMap, uniqueIDField: 'catalogNumber' });
        upload = await this.uploadRepo.save(upload);

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        await this.uploadCleanupQueue.add({
            id: upload.id,
            deleteAfter: tomorrow,
        });

        return upload;
    }

    async patchUploadFieldMap(id: number, uniqueIDField: string, fieldMap: OccurrenceUploadFieldMap): Promise<OccurrenceUpload> {
        const upload = await this.uploadRepo.findOne(id);
        if (!upload) {
            return null;
        }
        await this.uploadRepo.save({
            ...upload,
            uniqueIDField,
            fieldMap
        });
        return upload;
    }

    async findUploadByID(id: number): Promise<OccurrenceUpload> {
        return this.uploadRepo.findOne(id);
    }

    async deleteUploadByID(id: number): Promise<boolean> {
        const upload = await this.uploadRepo.delete({ id });
        return upload.affected > 0;
    }

    /**
     * @return Object The value of uniqueField for each row in
     * csvFile along with a count of the null values
     */
    async countCSVNonNull(csvFile: string, uniqueField: string): Promise<{ uniqueValues: any[], nulls: number }> {
        const uniqueFieldValues = new Set();
        let nulls = 0;

        try {
            for await (const batch of csvIterator<Record<string, unknown>>(csvFile)) {
                for (const row of batch) {
                    const fieldVal = row[uniqueField];
                    if (fieldVal) {
                        uniqueFieldValues.add(fieldVal);
                    }
                    else {
                        nulls += 1;
                    }
                }
            }
        } catch (e) {
            throw new Error('Error parsing CSV');
        }

        return { uniqueValues: [...uniqueFieldValues], nulls };
    }

    async countOccurrences(collectionID: number, field: string, isIn: any[]): Promise<number> {
        if (isIn.length === 0) {
            return 0;
        }

        const result = await this.occurrenceRepo.createQueryBuilder('o')
            .select([`COUNT(DISTINCT o.${field}) as cnt`])
            .where(`o.collectionID = :collectionID`, { collectionID })
            .andWhere(`o.${field} IS NOT NULL`)
            .andWhere(`o.${field} IN (:...isIn)`, { isIn })
            .getRawOne<{ cnt: number }>();

        return result.cnt;
    }

    async startUpload(uid: number, collectionID: number, uploadID: number): Promise<void> {
        await this.uploadQueue.add({ uid, collectionID, uploadID });
    }

    async createDwCArchive(tmpDir: string, findOpts: FindConditions<Occurrence>): Promise<string> {
        const dwcBuilder = new DwcArchiveBuilder(Occurrence, tmpDir);

        // Make sure all of the occurrences have a guid
        await this.occurrenceRepo.createQueryBuilder('o')
            .update({ occurrenceGUID: () => "CONCAT('urn:uuid:', UUID())" })
            .where({ ...findOpts, occurrenceGUID: IsNull() })
            .execute();

        let offset = 0;
        let occurrences = await this.occurrenceRepo.find({
            where: findOpts,
            take: OccurrenceService.DWCA_CREATE_LIMIT,
            skip: offset,
            relations: ['taxon']
        });


        while (occurrences.length > 0) {
            await Promise.all(occurrences.map((o) => dwcBuilder.addRecord(o)));
            offset += occurrences.length;
            occurrences = await this.occurrenceRepo.find({
                where: findOpts,
                take: OccurrenceService.DWCA_CREATE_LIMIT,
                skip: offset,
            });
        }

        const archivePath = pathJoin(tmpDir, `${uuid4()}.zip`);
        await dwcBuilder.build(archivePath);

        return archivePath;
    }
}
