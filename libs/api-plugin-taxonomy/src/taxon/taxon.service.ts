import { Inject, Injectable, Logger } from '@nestjs/common';
import {
    TaxaEnumTreeEntry,
    Taxon,
    TaxonomicStatus,
    TaxonomicUnit,
    TaxonomyUpload,
    TaxonomyUploadFieldMap,
    TaxonVernacular
} from '@symbiota2/api-database';
import { In, Like, Repository, Raw } from 'typeorm';
import { BaseService, csvIterator } from '@symbiota2/api-common';
import { DwCArchiveParser, dwcCoreID, getDwcField, isDwCID } from '@symbiota2/dwc';
import { TaxonFindAllParams, TaxonFindNamesParams } from './dto/taxon-find-parms';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QUEUE_ID_TAXONOMY_UPLOAD_CLEANUP } from '../queues/taxonomy-upload-cleanup.queue';
import { TaxonomyUploadCleanupJob } from '../queues/taxonomy-upload-cleanup.processor';
import { QUEUE_ID_TAXONOMY_UPLOAD } from '../queues/taxonomy-upload.queue';
import { TaxonomyUploadJob } from '../queues/taxonomy-upload.processor';

@Injectable()
export class TaxonService extends BaseService<Taxon>{
    private static readonly UPLOAD_CHUNK_SIZE = 1024;
    private static readonly LOGGER = new Logger(TaxonService.name);

    constructor(
        @Inject(Taxon.PROVIDER_ID)
        private readonly taxonRepo: Repository<Taxon>,
        @Inject(TaxonomicUnit.PROVIDER_ID)
        private readonly rankRepo: Repository<TaxonomicUnit>,
        @Inject(TaxonVernacular.PROVIDER_ID)
        private readonly vernacularRepo: Repository<TaxonVernacular>,
        @Inject(TaxonomicStatus.PROVIDER_ID)
        private readonly statusRepo: Repository<TaxonomicStatus>,
        @Inject(TaxonomyUpload.PROVIDER_ID)
        private readonly uploadRepo: Repository<TaxonomyUpload>,
        @Inject(TaxaEnumTreeEntry.PROVIDER_ID)
        private readonly treeRepo: Repository<TaxaEnumTreeEntry>,
        @InjectQueue(QUEUE_ID_TAXONOMY_UPLOAD_CLEANUP)
        private readonly uploadCleanupQueue: Queue<TaxonomyUploadCleanupJob>,
        @InjectQueue(QUEUE_ID_TAXONOMY_UPLOAD)
        private readonly uploadQueue: Queue<TaxonomyUploadJob>) {
        super(taxonRepo);
    }

    /**
     * Service to find all of the taxons possibly using an array of ids and a taxonomic authority ID
     * Can also limit the number fetched and use an offset.
     * Set find params using the 'TaxonAllParams'
     * @param params - the 'TaxonAllParams'
     * @returns Observable of response from api casted as `Taxon[]`
     * will be the found statements
     * @returns `of(null)` if api errors
     * @see Taxon
     * @see TaxonAllParams
     */
    async findAll(params?: TaxonFindAllParams): Promise<Taxon[]> {
        const { limit, offset, ...qParams } = params

        if (qParams.taxonAuthorityID) {
            // Have to use query builder since filter on nested relations does not work
            const qb = this.taxonRepo.createQueryBuilder('o')
                .leftJoin('o.taxonStatuses', 'c')
                //.take(limit)

                .where('c.taxonAuthorityID = :authorityID', { authorityID: params.taxonAuthorityID })

            if (qParams.id) {
                qb.andWhere('o.id IN (:...taxonIDs)', {taxonIDs: params.id})
            } else {
                // limit only if we don't have a list of ids
                qb.take(limit)
                qb.skip(offset)
            }
            return qb.getMany()
        } else {
            // Can use nested relations
            return (qParams.id)?
                await this.taxonRepo.find({
                    // No limit or offset if we have a list of ids
                    // take: limit,
                    // skip: offset,
                    where: { id: In(params.id) }})
                : await this.taxonRepo.find({
                    take: limit,
                    skip: offset })
        }
    }

    /**
     * Service to find all of the taxons for a given rank possibly using a taxonomic authority ID
     * @param rankID - the rankID
     * @param authorityID - the authorityID (optional)
     * @returns Observable of response from api casted as `Taxon[]`
     * will be the found statements
     * @returns `of(null)` if api errors
     * @see Taxon
     */
    async findAllAtRank(rankID: number, authorityID?: number): Promise<Taxon[]> {

        // Have to use query builder since filter on nested relations does not work
        const qb = this.taxonRepo.createQueryBuilder('o')
            .innerJoin('o.taxonStatuses', 'c')
            .where('o.rankID = :rankID', { rankID: rankID })

        // If there is an authority limit to the authority
        if (authorityID) {
            qb.andWhere('c.taxonAuthorityID = :authorityID', {authorityID: authorityID})
        }

        return qb.getMany()
    }

    /**
     * Find all of the taxons possibly using an array of ids and
     * a taxonomic authority ID, and include the authors with the result
     * Can also limit the number fetched and use an offset.
     * Set find params using the 'TaxonFindNamesParams'
     * @param params - the 'TaxonFindNamesParams'
     * @returns Observable of response from api casted as `Taxon[]`
     * will be the found statements
     * @returns `of(null)` if api errors
     * @see Taxon
     * @see TaxonFindNamesParams
     */
    async findAllScientificNamesPlusAuthors(params?: TaxonFindNamesParams): Promise<Taxon[]> {
        const { limit,...qParams } = params
        if (qParams.taxonAuthorityID) {
            const qb = this.taxonRepo.createQueryBuilder('o')
                .select([
                    'o.scientificName',
                    'o.author'
                ])
                .limit(params.limit || TaxonFindNamesParams.MAX_LIMIT) // TODO: set up a better way to lmiit
                .innerJoin('o.taxonStatuses', 'c')
                .where(
                    'c.taxonAuthorityID = :authorityID',
                    { authorityID: params.taxonAuthorityID }
                )

            if (qParams.id) {
                qb.andWhere(
                    'o.id IN (:...taxonIDs)',
                    {taxonIDs: params.id}
                )
            }

            if (qParams.partialName) {
                qb.andWhere(
                    'o.scientificName LIKE :name',
                    {name: params.partialName + '%'}
                )
            }
            return await qb.getMany()
        } else {
            return (qParams.id)?
                await this.taxonRepo.find({
                    select: ["scientificName", "author"],
                    where: { id: In(params.id) },
                    take: TaxonFindAllParams.MAX_LIMIT})
                : await this.taxonRepo.find({
                    select: ["scientificName", "author"],
                    take: TaxonFindAllParams.MAX_LIMIT
                })
        }
    }

    /**
     * Find all of the scientific names of taxons possibly using an array of ids and
     * a taxonomic authority ID
     * Set find params using the 'TaxonFindNamesParams'
     * @param params - the 'TaxonFindNamesParams'
     * @returns Observable of response from api casted as `Taxon[]`
     * will be the found statements
     * @returns `of(null)` if api errors
     * @see Taxon
     * @see TaxonFindNamesParams
     */
    async findAllScientificNames(params?: TaxonFindNamesParams): Promise<Taxon[]> {
        //console.log("Taxon service: finding scientific names")
        const { limit,...qParams } = params

        if (qParams.taxonAuthorityID) {
            const qb = this.taxonRepo.createQueryBuilder('o')
                .select([
                    'o.scientificName'
                ])
                .limit(params.limit || TaxonFindNamesParams.MAX_LIMIT) // TODO: set up a better way to lmiit
                .innerJoin('o.taxonStatuses', 'c')
                .where('c.taxonAuthorityID = :authorityID', { authorityID: params.taxonAuthorityID })

            if (qParams.partialName) {
                qb.andWhere('o.scientificName LIKE :name', {name: params.partialName + '%'})
            }
            if (qParams.id) {
                qb.andWhere('o.id IN (:...taxonIDs)', {taxonIDs: params.id})
            }
            return await qb.getMany()
        } else {
            return (qParams.id)?
                await this.taxonRepo.find({
                    select: ["scientificName"],
                    where: { id: In(params.id) },
                    take: TaxonFindAllParams.MAX_LIMIT})
                : await this.taxonRepo.find({
                    select: ["scientificName"],
                    take: TaxonFindAllParams.MAX_LIMIT
                })
        }
    }

    /**
     * Project the sciname from the taxa table for the rank of family using possibly
     * a list of taxaIDs and an authority ID
     * Set find params using the 'TaxonFindNamesParams'
     * @param params - the 'TaxonFindNamesParams'
     * @returns Observable of response from api casted as `Taxon[]`
     * will be the found statements
     * @returns `of(null)` if api errors
     * @see Taxon
     * @see TaxonFindNamesParams
     */
    async findFamilyNames(params?: TaxonFindNamesParams): Promise<Taxon[]> {
        const { limit,...qParams } = params

        if (qParams.taxonAuthorityID) {
            const qb = this.taxonRepo.createQueryBuilder('o')
                .select([
                    'o.scientificName', 'o.id'
                ])
                .innerJoin('o.taxonStatuses', 'c')
                .where('c.taxonAuthorityID = :authorityID',
                    { authorityID: params.taxonAuthorityID })
                .andWhere('c.rankID = :rankID',
                    { rankID: 140 }) // [TODO Get the actual family rank id]

            if (qParams.partialName) {
                qb.andWhere('o.scientificName LIKE :name', {name: params.partialName + '%'})
            }
            if (qParams.id) {
                qb.andWhere('o.id IN (:...taxonIDs)', {taxonIDs: params.id})
            }
            return await qb.getMany()
        } else {
            return (qParams.id)?
                await this.taxonRepo.find({
                    select: ["scientificName", "id"],
                    where: { id: In(params.id), rankID: 140 } // [TODO Get the actual family rank id]
                })
                : await this.taxonRepo.find({
                    select: ["scientificName","id"],
                    where: { rankID: 140 } // [TODO Get the actual family rank id]
                })
        }
    }

    /**
     * Project the sciname from the taxa table for the rank of genus using possibly
     * a list of taxaIDs and an authority ID
     * Set find params using the 'TaxonFindNamesParams'
     * @param params - the 'TaxonFindNamesParams'
     * @returns Observable of response from api casted as `Taxon[]`
     * will be the found statements
     * @returns `of(null)` if api errors
     * @see Taxon
     * @see TaxonFindNamesParams
     */
    async findGenusNames(params?: TaxonFindNamesParams): Promise<Taxon[]> {
        //console.log("Taxon service: finding scientific names")
        const { limit,...qParams } = params

        if (qParams.taxonAuthorityID) {
            const qb = this.taxonRepo.createQueryBuilder('o')
                .select([
                    'o.scientificName','o.id'
                ])
                .innerJoin('o.taxonStatuses', 'c')
                .where('c.taxonAuthorityID = :authorityID',
                    { authorityID: params.taxonAuthorityID })
                .andWhere('c.rankID = :rankID',
                    { rankID: 180 }) // [TODO Get the actual genus rank id]

            if (qParams.partialName) {
                qb.andWhere('o.scientificName LIKE :name', {name: params.partialName + '%'})
            }
            if (qParams.id) {
                qb.andWhere('o.id IN (:...taxonIDs)', {taxonIDs: params.id})
            }
            return await qb.getMany()
        } else {
            return (qParams.id)?
                await this.taxonRepo.find({
                    select: ["scientificName", "id"],
                    where: { id: In(params.id), rankID: 180 } // [TODO Get the actual genus rank id]
                })
                : await this.taxonRepo.find({
                    select: ["scientificName","id"],
                    where: { rankID: 180 } // [TODO Get the actual genus rank id]
                })
        }
    }

    /**
     * Project the sciname from the taxa table for the rank of species using possibly
     * a list of taxaIDs and an authority ID
     * Set find params using the 'TaxonFindNamesParams'
     * @param params - the 'TaxonFindNamesParams'
     * @returns Observable of response from api casted as `Taxon[]`
     * will be the found statements
     * @returns `of(null)` if api errors
     * @see Taxon
     * @see TaxonFindNamesParams
     */
    async findSpeciesNames(params?: TaxonFindNamesParams): Promise<Taxon[]> {
        const { limit,...qParams } = params

        if (qParams.taxonAuthorityID) {
            const qb = this.taxonRepo.createQueryBuilder('o')
                .select([
                    'o.scientificName', 'o.id'
                ])
                .innerJoin('o.taxonStatuses', 'c')
                .where('c.taxonAuthorityID = :authorityID',
                    { authorityID: params.taxonAuthorityID })
                .andWhere('c.rankID = :rankID',
                    { rankID: 220 }) // [TODO Get the actual genus rank id]

            if (qParams.partialName) {
                qb.andWhere('o.scientificName LIKE :name', {name: params.partialName + '%'})
            }
            if (qParams.id) {
                qb.andWhere('o.id IN (:...taxonIDs)', {taxonIDs: params.id})
            }
            return await qb.getMany()
        } else {
            return (qParams.id)?
                (qParams.partialName)?
                    await this.taxonRepo.find({
                        select: ["scientificName", "id"],
                        where: { id: In(params.id),
                            rankID: 220, // [TODO Get the actual genus rank id]
                            scientificName: Like(params.partialName + '%') }
                    })
                    : await this.taxonRepo.find({
                        select: ["scientificName", "id"],
                        where: { id: In(params.id), rankID: 220 } // [TODO Get the actual genus rank id]
                    })
                : (qParams.partialName)?
                    await this.taxonRepo.find({
                        select: ["scientificName","id"],
                        where: {
                            rankID: 220, // [TODO Get the actual genus rank id]
                            scientificName: Like(params.partialName + '%')
                        }
                    })
                    : await this.taxonRepo.find({
                        select: ["scientificName","id"],
                        where: { rankID: 220 } // [TODO Get the actual genus rank id]
                    })
        }
    }

    /**
     * Find the taxons that match a given scientific name, possibly using an authority id
     * Set find params using the 'TaxonFindNamesParams'
     * @param params - the 'TaxonFindNamesParams'
     * @returns Observable of response from api casted as `Taxon[]`
     * will be the found statements
     * @returns `of(null)` if api errors
     * @see Taxon
     * @see TaxonFindNamesParams
     */
    async findByScientificName(sciname: string, params?: TaxonFindNamesParams): Promise<Taxon[]> {
        const { ...qParams } = params
        if (qParams.taxonAuthorityID) {
            // Have to use the query builder since where filter on nested relations does not work
            const qb = this.taxonRepo.createQueryBuilder('o')
                .innerJoin('o.taxonStatuses', 'c')
                .where('c.taxonAuthorityID = :authorityID', { authorityID: params.taxonAuthorityID })
                .andWhere('o.scientificName = :sciname', {sciname: sciname})

            return await qb.getMany()
        } else {
            return await this.taxonRepo.find({ where: { scientificName: sciname } })
        }
    }

    /**
     * Find a taxon and its synonyms using a taxon ID.
     * @param id - the taxon id
     * @returns Observable of response from api casted as `Taxon`
     * will be the found taxon
     * @returns `of(null)` if api errors or not found
     * @see Taxon
     */
    async findByTIDWithSynonyms(id: number): Promise<Taxon> {
        return this.taxonRepo.findOne({
            relations: ["acceptedTaxonStatuses", "acceptedTaxonStatuses.parentTaxon"],
            where: {id: id}
        })
    }

    /**
     * Find a taxon using a taxon ID.
     * @param id - the taxon id
     * @returns Observable of response from api casted as `Taxon`
     * will be the found taxon
     * @returns `of(null)` if api errors or not found
     * @see Taxon
     */
    async findByTID(id: number): Promise<Taxon> {
        return this.taxonRepo.findOne({ where: {id: id} })
    }

    /**
     * Returns a list of the fields of the taxon entity
     */
    getFields(): string[] {
        const entityColumns = this.taxonRepo.metadata.columns;
        return entityColumns.map((c) => c.propertyName);
    }

    private eliminateDuplicates(data) {
        return data.filter((value, index) => data.indexOf(value) === index)
    }

    /**
     * Returns a list of the fields of the taxon entity plus any related entities for upload purposes
     */
    getAllTaxonomicUploadFields(): string[] {
        const entityColumns = this.taxonRepo.metadata.columns
        const statusColumns = this.statusRepo.metadata.columns
        //const vernacularColumns = this.vernacularRepo.metadata.columns
        //const rankColumns = this.rankRepo.metadata.columns
        const artificialColumns = ["AcceptedTaxonName", "ParentTaxonName", "RankName"]
        const allColumns = entityColumns
            .concat(statusColumns)
            //.concat(vernacularColumns)
            //.concat(rankColumns)
        return this.eliminateDuplicates(allColumns.map((c) => c.propertyName).concat(artificialColumns))
    }

    /**
     * Create a taxon record using a Partial Taxon record
     * @param data The data for the record to create
     * @return number The created data or null (not found)
     */
    async create(data: Partial<Taxon>): Promise<Taxon> {
        const taxon = this.taxonRepo.create(data);
        return this.taxonRepo.save(taxon);
    }

    /**
     * Update a taxon record using a taxon id.
     * @param id The id of the taxon
     * @param data The data to update
     * @return Taxon The updated data or null (not found or api error)
     */
    async updateByID(id: number, data: Partial<Taxon>): Promise<Taxon> {
        const updateResult = await this.taxonRepo.update({ id }, data);
        if (updateResult.affected > 0) {
            return this.findByID(id)
        }
        return null
    }

    /**
     * Creates a new upload in the database
     * @param filePath The path to the file containing occurrences
     * @param mimeType The mimeType of the file
     * @param fieldMap Object describing how upload fields map to the occurrence database
     */
    async createUpload(filePath: string, mimeType: string, fieldMap: TaxonomyUploadFieldMap): Promise<TaxonomyUpload> {
        let upload = this.uploadRepo.create({ filePath, mimeType, fieldMap, uniqueIDField: 'taxonID' });
        upload = await this.uploadRepo.save(upload);

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        await this.uploadCleanupQueue.add({
            id: upload.id,
            deleteAfter: tomorrow,
        });

        return upload;
    }

    async patchUploadFieldMap(id: number, uniqueIDField: string, fieldMap: TaxonomyUploadFieldMap): Promise<TaxonomyUpload> {
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

    async findUploadByID(id: number): Promise<TaxonomyUpload> {
        return this.uploadRepo.findOne(id)
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

    async countTaxons(authorityID: number, field: string, isIn: any[]): Promise<number> {
        if (isIn.length === 0) {
            return 0;
        }

        const result = await this.taxonRepo.createQueryBuilder('o')
            .select([`COUNT(DISTINCT o.${field}) as cnt`])
            //.where(`o.collectionID = :collectionID`, { collectionID })
            //.andWhere(`o.${field} IS NOT NULL`)
            .where(`o.${field} IS NOT NULL`)
            .andWhere(`o.${field} IN (:...isIn)`, { isIn })
            .getRawOne<{ cnt: number }>();

        return result.cnt;
    }

    async startUpload(uid: number, authorityID: number, uploadID: number): Promise<void> {
        await this.uploadQueue.add({
            uid: uid,
            authorityID: authorityID,
            uploadID: uploadID,
            taxonUpdates : [],
            skippedTaxonsDueToMulitpleMatch: [],
            skippedTaxonsDueToMismatchRank: [],
            skippedTaxonsDueToMissingName: [],
            statusUpdates : [],
            skippedStatusesDueToMultipleMatch: [],
            skippedStatusesDueToAcceptedMismatch: [],
            skippedStatusesDueToParentMismatch: [],
            skippedStatusesDueToTaxonMismatch: []
            })
    }

    /**
     * @param kingdomName The kingdom that the taxon belongs to
     * @param rankName The name of the taxon's rank
     * @param scientificName The scientificName for the taxon
     * @return number The taxonID if it exists, otherwise -1
     */
    async findTaxonID(kingdomName: string, rankName: string, scientificName: string): Promise<number> {
        const taxonRank = await this.rankRepo.findOne({
            kingdomName: Raw((kn) => `LOWER(${kn}) = LOWER('${kingdomName}')`),
            rankName: Raw((rn) => `LOWER(${rn}) = LOWER('${rankName}')`)
        });

        if (!taxonRank) {
            return -1;
        }

        const taxon = await this.taxonRepo.findOne({
            select: ['id'],
            where: {
                scientificName,
                rankID: taxonRank.rankID
            }
        })
        return taxon ? taxon.id : -1;
    }

    async fromDwcA(filename: string): Promise<void> {
        let taxonBuffer = [];
        const kingdomNameDwcUri = getDwcField(Taxon, 'kingdom');
        const sciNameDwcUri = getDwcField(Taxon, 'scientificName');
        const rankNameDwcUri = getDwcField(Taxon, 'rankName');
        const authorDwcUri = getDwcField(Taxon, 'author');

        for await (const csvTaxon of DwCArchiveParser.read(filename, Taxon.DWC_TYPE)) {
            if (taxonBuffer.length > TaxonService.UPLOAD_CHUNK_SIZE) {
                await this.taxonRepo.save(taxonBuffer);
                taxonBuffer = [];
            }

            let author = csvTaxon[authorDwcUri];
            const kingdomName = csvTaxon[kingdomNameDwcUri];
            const rankName = csvTaxon[rankNameDwcUri];
            let sciName = csvTaxon[sciNameDwcUri];

            // Clean authorship out of sciName
            if (author) {
                // Thanks to
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
                // For the regex to escape all regex special characters
                const authorRegexpClean = author.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const authorRegexp = new RegExp(`\\s*(${authorRegexpClean})\\s*`);
                sciName = sciName.replace(authorRegexp, '');
            }

            if (!kingdomName) {
                TaxonService.LOGGER.warn(`Taxon does not have a kingdom! Skipping...`);
                continue;
            }
            if (!rankName) {
                TaxonService.LOGGER.warn(`Taxon does not have a rankName! Skipping...`);
                continue;
            }
            if (!sciName) {
                TaxonService.LOGGER.warn(`Taxon does not have a scientificName! Skipping...`);
                continue;
            }

            const taxon = this.taxonRepo.create();
            taxon.scientificName = sciName;
            taxon.author = author;

            // Avoid duplicate uploads
            const taxonID = await this.findTaxonID(kingdomName, rankName, sciName);
            if (taxonID !== -1) {
                taxon.id = taxonID;
            }

            // Since we've already manipulated these we don't want to overwrite
            // them
            const setFields = [
                getDwcField(Taxon, 'id'),
                sciNameDwcUri,
                authorDwcUri
            ];

            let extraTaxonFields = this.taxonRepo.manager.connection
                .getMetadata(Taxon)
                .columns
                .map((c) => c.propertyName)
                .filter((prop) => !setFields.includes(prop));

            const csvFields = Object.keys(csvTaxon);

            for (const field of extraTaxonFields) {
                const dwcFieldUri = getDwcField(Taxon, field);
                if (dwcFieldUri && csvFields.includes(dwcFieldUri)) {
                    taxon[field] = csvTaxon[dwcFieldUri];
                    setFields.push(dwcFieldUri);
                }
            }

            // Store any fields we don't support in dynamic properties
            taxon.dynamicProperties = csvFields.filter((f) => {
                return !setFields.includes(f);
            }).reduce((props, f) => {
                props[f] = csvTaxon[f];
                return props;
            }, { ...taxon.dynamicProperties });

            taxonBuffer.push(taxon);
        }

        await this.taxonRepo.save(taxonBuffer);
    }

    async findAncestorTaxonIDs(taxonID: number): Promise<number[]> {
        const treeEntries = await this.treeRepo.find({
            select: ['parentTaxonID'],
            where: { taxonID }
        });
        return treeEntries.map((te) => te.parentTaxonID);
    }

    async linkTaxonToAncestors(taxon: Taxon, directParentTaxon: Taxon): Promise<void> {
        // TODO: Get rid of taxonomic authorities?
        const directParentTreeEntry = this.treeRepo.create({
            taxonAuthorityID: 1,
            taxonID: taxon.id,
            parentTaxonID: directParentTaxon.id
        });
        await this.treeRepo.save(directParentTreeEntry);

        const ancestorSaves = [];
        const ancestorIDs = await this.findAncestorTaxonIDs(
            directParentTreeEntry.parentTaxonID
        );
        for (const ancestorID of ancestorIDs) {
            const ancestorEntry = this.treeRepo.create({
                taxonAuthorityID: 1,
                taxonID: taxon.id,
                parentTaxonID: ancestorID
            });
            const savePromise = this.treeRepo.save(ancestorEntry);
            ancestorSaves.push(savePromise);
        }

        await Promise.all(ancestorSaves);
    }
}
