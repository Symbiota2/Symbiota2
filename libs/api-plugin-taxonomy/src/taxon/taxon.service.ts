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
import { Repository, Raw } from 'typeorm';
import { BaseService, csvIterator } from '@symbiota2/api-common';
import { DwCArchiveParser, getDwcField } from '@symbiota2/dwc';
import { TaxonFindAllParams, TaxonFindByMatchingParams, TaxonFindNamesParams } from './dto/taxon-find-parms';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QUEUE_ID_TAXONOMY_UPLOAD_CLEANUP } from '../queues/taxonomy-upload-cleanup.queue';
import { TaxonomyUploadCleanupJob } from '../queues/taxonomy-upload-cleanup.processor';
import { QUEUE_ID_TAXONOMY_UPLOAD } from '../queues/taxonomy-upload.queue';
import { TaxonomyUploadJob } from '../queues/taxonomy-upload.processor';
import { StorageService } from '@symbiota2/api-storage';
import path from 'path';

@Injectable()
export class TaxonService extends BaseService<Taxon>{
    private static readonly S3_PREFIX = 'taxon';
    private static readonly UPLOAD_CHUNK_SIZE = 1024;
    private static readonly LOGGER = new Logger(TaxonService.name);
    public static readonly dataFolderPath = path.join("data", "uploads", "taxa")
    public static readonly problemParentNamesPath = path.join(TaxonService.dataFolderPath, "problemParentNames")
    public static readonly problemAcceptedNamesPath = path.join(TaxonService.dataFolderPath, "problemAcceptedNames")
    public static readonly problemRanksPath = path.join(TaxonService.dataFolderPath, "problemRanks")
    public static readonly skippedTaxonsDueToMultipleMatchPath = path.join(TaxonService.dataFolderPath, "taxonsMultipleMatch")
    public static readonly skippedTaxonsDueToMismatchRankPath = path.join(TaxonService.dataFolderPath, "taxonsMismatch")
    public static readonly skippedTaxonsDueToMissingNamePath = path.join(TaxonService.dataFolderPath, "taxonsMissing")

    // list of all the updates to do to status records
    public static readonly skippedStatusesDueToMultipleMatchPath = path.join(TaxonService.dataFolderPath, "statusesMultipleMatch")
    public static readonly skippedStatusesDueToAcceptedMismatchPath = path.join(TaxonService.dataFolderPath, "statusesAcceptedMismatch")
    public static readonly skippedStatusesDueToParentMismatchPath = path.join(TaxonService.dataFolderPath, "statusesParentMismatch")
    public static readonly skippedStatusesDueToTaxonMismatchPath = path.join(TaxonService.dataFolderPath, "statusesTaxonMismatch")

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
        private readonly uploadQueue: Queue<TaxonomyUploadJob>,
        private readonly storageService: StorageService)
    {
        super(taxonRepo);
        //this.taxonRepo = getCustomRepository(ElasticsearchRepository)
    }

    public static s3Key(objectName: string): string {
        return [TaxonService.S3_PREFIX, objectName].join('/');
    }

    /**
     * Service to find all of the taxons possibly using an array of ids, a scientific name,
     * and/or a taxonomic authority ID
     * Can also limit the number fetched and use an offset.
     * Set find params using the 'TaxonFindAllParams'
     * @param params - the 'TaxonFindAllParams'
     * @returns Observable of response from api casted as `Taxon[]`
     * will be the found statements
     * @returns `of(null)` if api errors
     * @see Taxon
     * @see TaxonFindAllParams
     */
    async findAll(params?: TaxonFindAllParams): Promise<Taxon[]> {
        const { limit, offset, ...qParams } = params

        const qb = this.taxonRepo.createQueryBuilder('o')
            .where("true")

        /*  Since we are looking for names, we don't care about the authority
        if (qParams.taxonAuthorityID) {
            // Have to use query builder since filter on nested relations does not work
            qb.innerJoin('o.taxonStatuses', 'c')
                .where('c.taxonAuthorityID = :authorityID', { authorityID: params.taxonAuthorityID })

        }
         */

        if (qParams.id) {
            qb.andWhere('o.id IN (:...taxonIDs)', {taxonIDs: params.id})
        }

        // Don't limit if it has filters
        if (limit && !(qParams.id || qParams.scientificName)) {
            qb.take(limit)
        }

        if (offset && !(qParams.id || qParams.scientificName)) {
            qb.skip(offset)
        }

        if (qParams.scientificName) {
            qb.andWhere('o.scientificName = :sciname', {sciname: params.scientificName})
        }

        return qb.getMany()
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
     * Find all of the scientific names of taxons possibly using filters in TaxonFindNamesParams
     * Set find params using the 'TaxonFindNamesParams'
     * @param params - the 'TaxonFindNamesParams'
     * @returns Observable of response from api casted as `Taxon[]`
     * will be the found taxons or empty list if nothing found
     * @returns `of(null)` if api errors
     * @see Taxon
     * @see TaxonFindNamesParams
     */
    async findAllScientificNames(params?: TaxonFindNamesParams): Promise<Taxon[]> {
        const { limit,...qParams } = params

        const qb = this.taxonRepo.createQueryBuilder('o')
            .select([
                'o.scientificName',
                'o.author',
                'o.id'
            ])
            .limit(params.limit || TaxonFindNamesParams.MAX_LIMIT) // TODO: set up a better way to lmiit
            .where("true")

        // See if we need to join with taxonomic status table
        /*
        if (qParams.taxonAuthorityID) {
            qb.leftJoin('o.taxonStatuses', 'c')
                .andWhere('c.taxonAuthorityID = :authorityID', { authorityID: params.taxonAuthorityID })
        }
         */

        // See if we need to join with images table
        if (qParams.withImages) {
            qb.innerJoin('o.images', 'i')
                .distinct(true)  // need to turn on because could be several images per taxon
        }

        if (qParams.rankID) {
            qb.andWhere('o.rankID = :id', {id: params.rankID})
        }

        if (qParams.kingdom) {
            qb.andWhere('o.kingdomName = :name', {name: params.kingdom})
        }

        if (qParams.partialName) {
            qb.andWhere('o.scientificName LIKE :name', {name: params.partialName + '%'})
        }

        if (qParams.id) {
            qb.andWhere('o.id IN (:...taxonIDs)', {taxonIDs: params.id})
        }
        return await qb.getMany()
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

    async patchUploadFieldMap(id: number, /*uniqueIDField: string,*/ fieldMap: TaxonomyUploadFieldMap): Promise<TaxonomyUpload> {
        const upload = await this.uploadRepo.findOne(id);
        if (!upload) {
            return null
        }
        await this.uploadRepo.save({
            ...upload,
            //uniqueIDField,
            fieldMap
        });
        return upload
    }

    async getStream(key) {
        const stream = await this.storageService.getObject(key)
        const chunks = [];
        stream.on('data', (d) => chunks.push(d));
        return chunks[0]

        /*
        const stream = await this.storage.getData(key)
        //const data  = stream.read()
        return stream

         */
    }

    async getProblemAcceptedNames(): Promise<string[]> {
        return await this.getStringListData(TaxonService.s3Key(TaxonService.problemAcceptedNamesPath))
    }

    async getProblemParentNames(): Promise<string[]> {
        return await this.getStringListData(TaxonService.s3Key(TaxonService.problemParentNamesPath))
    }

    async getProblemRanks(): Promise<string[]> {
        return await this.getStringListData(TaxonService.s3Key(TaxonService.problemRanksPath))
    }

    async getProblemUploadRows(): Promise<string[]> {
        const result = [
            TaxonService.skippedTaxonsDueToMultipleMatchPath,
            TaxonService.skippedTaxonsDueToMismatchRankPath,
            TaxonService.skippedTaxonsDueToMissingNamePath,

            // list of all the updates to do to status records
            TaxonService.skippedStatusesDueToMultipleMatchPath,
            TaxonService.skippedStatusesDueToAcceptedMismatchPath,
            TaxonService.skippedStatusesDueToParentMismatchPath,
            TaxonService.skippedStatusesDueToTaxonMismatchPath
            ]

        const myList = []
        for (const key of result) {
            const row = await TaxonService.s3Key(key)
            const value = await this.getStringData(row)
            if (value != null) {
                myList.push(value)
            }
        }
        return myList
    }

    private async getStringData(key): Promise<string> {
        // See if there exists such an object
        const exists = await this.storageService.hasObject(key)
        if (!exists) {
            return null
        }

        // Fetch the object if it exists
        const buffer = await this.storageService.getData(key)
        return buffer.toString()
    }

    private async getStringListData(key): Promise<string[]> {
        // See if there exists such an object
        const exists = await this.storageService.hasObject(key)
        if (!exists) {
            return []
        }

        // Fetch the object if it exists
        const buffer = await this.storageService.getData(key)
        return JSON.parse(buffer.toString())
    }

    async findUploadByID(id: number): Promise<TaxonomyUpload> {
        return this.uploadRepo.findOne(id)
    }

    async deleteUploadByID(id: number): Promise<boolean> {
        const upload = await this.uploadRepo.delete({ id });
        return upload.affected > 0;
    }

    /**
     * @return List of strings with problem parent names and a count of null parent
     */
    async taxonCheck(
        csvFile: string,
        sciNameField: string,
        parentNameField: string,
        acceptedNameField: string,
        kingdomNameField: string,
        rankNameField: string
    ): Promise<{
        problemScinames: number,
        problemAcceptedNames: number,
        problemParentNames: number,
        problemRanks: number,
        nullSciNames: number,
        nullParentNames: number,
        nullKingdomNames: number,
        nullAcceptedNames: number,
        nullRankNames: number,
        totalRecords: number
    }> {
        const taxons  = new Set()
        const parentTaxons  = new Set()
        const acceptedTaxons  = new Set()
        const ranks : Set<string> = new Set()
        let nullSciNames = 0
        let nullParentNames = 0
        let nullAcceptedNames = 0
        let nullKingdomNames = 0
        let nullRankNames = 0
        let totalRecords = 0

        try {
            for await (const batch of csvIterator<Record<string, unknown>>(csvFile)) {
                for (const row of batch) {
                    totalRecords += 1

                    // Check rank and kingdom name

                    if (row[rankNameField] && row[kingdomNameField]) {
                        const rankVal = row[rankNameField] + ""
                        const kingdomVal = row[kingdomNameField] + ""
                        ranks.add(kingdomVal.trim() + ":" + rankVal.trim())
                    }
                    if (!row[rankNameField]) {
                        nullRankNames += 1
                    }
                    if (!row[kingdomNameField]) {
                        nullKingdomNames += 1
                    }

                    // Check scientific name
                    let fieldVal = null
                    if (row[sciNameField]) {
                        fieldVal = row[sciNameField] + ""
                        taxons.add(fieldVal.trim())
                    }
                    else {
                        nullSciNames += 1
                    }

                    // Check parent name
                    if (row[parentNameField]) {
                        fieldVal = row[parentNameField] + ""
                        parentTaxons.add(fieldVal.trim())
                    }
                    else {
                        nullParentNames += 1
                    }

                    // Check accepted name
                    if (row[acceptedNameField]) {
                        fieldVal = row[acceptedNameField] + ""
                        acceptedTaxons.add(fieldVal.trim())
                    }
                    else {
                        nullAcceptedNames += 1
                    }

                }
            }
        } catch (e) {
            throw new Error('Error parsing CSV')
        }

        const problemParentNames = []
        const problemScinames = []
        const problemAcceptedNames = []
        const problemRanks = []

        // Check to see if the parent names exist
        for (let key of parentTaxons.keys()) {
            if (!taxons.has(key)) {
                // Need to check name
                const taxons = await this.taxonRepo.find({ where: { scientificName: key } })
                if (taxons.length == 0) {
                    problemParentNames.push(key)
                }
            }
        }
        //problemParentNamesStream.end()
        await this.storageService.putData(TaxonService.s3Key(TaxonService.problemParentNamesPath), JSON.stringify(problemParentNames))

        // Check to see if accepted names exist
        for (let key of acceptedTaxons.keys()) {
            if (!taxons.has(key)) {
                // Need to check name
                const taxons = await this.taxonRepo.find({ where: { scientificName: key } })
                if (taxons.length == 0) {
                    problemAcceptedNames.push(key)
                    // problemAcceptedNamesStream.write(key)
                }
            }
        }
        // problemAcceptedNamesStream.end()
        await this.storageService.putData(TaxonService.s3Key(TaxonService.problemAcceptedNamesPath), JSON.stringify(problemAcceptedNames))

        // Get all the taxon and class names
        const allRanks = await this.rankRepo.find()
        const both = new Set()
        allRanks.forEach((rank) => {
            both.add(rank.kingdomName + ":" + rank.rankName)
        })

        // Check to see if the kingdom and rank names exist
        for (let key of ranks.keys()) {
            if (!both.has(key)) {
                problemRanks.push(key)
                    // problemRanksStream.write(key)
            }
        }
        // problemRanksStream.end()
        await this.storageService.putData(TaxonService.s3Key(TaxonService.problemRanksPath), JSON.stringify(problemRanks))

        return {
            problemScinames: problemScinames.length,
            problemAcceptedNames: problemAcceptedNames.length,
            problemParentNames: problemParentNames.length,
            problemRanks: problemRanks.length,
            nullSciNames: nullSciNames,
            nullParentNames: nullParentNames,
            nullKingdomNames: nullKingdomNames,
            nullAcceptedNames: nullAcceptedNames,
            nullRankNames: nullRankNames,
            totalRecords: totalRecords
        }
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
            skippedTaxonsDueToMultipleMatch: [],
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

    /**
     * Process a dwc archive & upload its taxa to the database
     * @param filename The path to the dwc archive
     */
    async fromDwcA(filename: string): Promise<void> {
        // Holds the current taxa being processed
        let taxonBuffer = [];

        // Get the dwc fields for the following database fields. See the
        // DwcField decorators on libs/api-database/src/entities/taxonomy/Taxon.entity.ts
        const kingdomNameDwcUri = getDwcField(Taxon, 'kingdom');
        const sciNameDwcUri = getDwcField(Taxon, 'scientificName');
        const rankNameDwcUri = getDwcField(Taxon, 'rankName');
        const authorDwcUri = getDwcField(Taxon, 'author');

        // Loop through each line in the csv
        for await (const csvTaxon of DwCArchiveParser.read(filename, Taxon.DWC_TYPE)) {

            // If the buffer is full, flush all of the taxa inside it to the database
            if (taxonBuffer.length > TaxonService.UPLOAD_CHUNK_SIZE) {
                await this.taxonRepo.save(taxonBuffer);
                taxonBuffer = [];
            }

            // Pull the following fields out of the csv
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

            // A taxon needs the following three fields in order to be stored in the db
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

            // Create an empty taxon & populate it with what we've found alredy
            const taxon = this.taxonRepo.create();
            taxon.scientificName = sciName;
            taxon.author = author;

            // If the taxon id exists in the db, overwrite the taxon
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

            // Get all of the columns in the db that we haven't discovered a value for
            // already
            let extraTaxonFields = this.taxonRepo.manager.connection
                .getMetadata(Taxon)
                .columns
                .map((c) => c.propertyName)
                .filter((prop) => !setFields.includes(prop));

            const csvFields = Object.keys(csvTaxon);

            for (const field of extraTaxonFields) {
                // Loop through all of the fields annotated with the DwcField decorator,
                // finding any matching columns in the csv
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

            // Add the taxon to the buffer
            taxonBuffer.push(taxon);
        }

        // Flush any remaining buffered taxa to the database
        await this.taxonRepo.save(taxonBuffer);
    }

    /**
     * @param taxonID The taxonID to find ancestors for
     * @returns The taxonIDs of all ancestors of the given taxonID
     */
    async findAncestorTaxonIDs(taxonID: number): Promise<number[]> {
        const treeEntries = await this.treeRepo.find({
            select: ['parentTaxonID'],
            where: { taxonID }
        });
        return treeEntries.map((te) => te.parentTaxonID);
    }

    /**
     * @param taxon The taxon to link to ancestor taxa
     * @param directParentTaxon The most direct parent of the given taxon. For the taxon
     * Arthropoda with rank phylum, this would be the kingdom Animalia. For the species Agapostemon angelicus,
     * this would be the genus Agapostemon. etc.
     */
    async linkTaxonToAncestors(taxon: Taxon, directParentTaxon: Taxon): Promise<void> {
        // Create a tree entry for the taxon & its direct parent and save it to the database
        const directParentTreeEntry = this.treeRepo.create({
            taxonAuthorityID: 1,
            taxonID: taxon.id,
            parentTaxonID: directParentTaxon.id
        });
        await this.treeRepo.save(directParentTreeEntry);

        // Find all of the ancestors of the direct parent. Its ancestors are also taxon's ancestors
        const ancestorSaves = [];
        const ancestorIDs = await this.findAncestorTaxonIDs(
            directParentTreeEntry.parentTaxonID
        );

        // Link each ancestor of the direct parent to taxon & save to the database
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
