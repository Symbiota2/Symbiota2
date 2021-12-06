import {
    InjectQueue,
    OnQueueCompleted,
    OnQueueFailed,
    Process,
    Processor
} from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { Inject, Logger } from '@nestjs/common';
import {
    TaxaEnumTreeEntry, Taxon, TaxonomicStatus, TaxonomicUnit, TaxonUpload,
    UserNotification, TaxonomyUpload
} from '@symbiota2/api-database';
import { DeepPartial, Repository } from 'typeorm';
import { QUEUE_ID_TAXONOMY_UPLOAD } from './taxonomy-upload.queue';
import { csvIterator } from '@symbiota2/api-common';
import { TaxonService } from '../taxon/taxon.service';

export interface TaxonomyUploadJob {
    uid: number;
    authorityID: number;
    uploadID: number;
}

@Processor(QUEUE_ID_TAXONOMY_UPLOAD)
export class TaxonomyUploadProcessor {
    private processed = 0;
    private readonly logger = new Logger(TaxonomyUploadProcessor.name);

    constructor(
        @Inject(TaxonUpload.PROVIDER_ID)
        private readonly uploads: Repository<TaxonomyUpload>,
        @Inject(UserNotification.PROVIDER_ID)
        private readonly notifications: Repository<UserNotification>,
        @Inject(Taxon.PROVIDER_ID)
        private readonly taxonRepo: Repository<Taxon>,
        @Inject(TaxonomicUnit.PROVIDER_ID)
        private readonly rankRepo: Repository<TaxonomicUnit>,
        //@Inject(TaxonVernacular.PROVIDER_ID)
        //private readonly vernacularRepo: Repository<TaxonVernacular>,
        @Inject(TaxonomicStatus.PROVIDER_ID)
        private readonly statusRepo: Repository<TaxonomicStatus>,
        @Inject(TaxaEnumTreeEntry.PROVIDER_ID)
        private readonly taxaEnumTree: Repository<TaxaEnumTreeEntry>) { }

    // TODO: Wrap in a transaction? Right now each chunk goes straight to the database until a failure occurs
    @Process()
    async upload(job: Job<TaxonomyUploadJob>): Promise<void> {
        this.processed = 0;

        const upload = await this.uploads.findOne(job.data.uploadID);
        if (!upload) {
            return;
        }
        this.logger.log(`Upload of '${upload.filePath}' started...`);

        let error: Error = null;
        for await (const batch of csvIterator<DeepPartial<Taxon>>(upload.filePath)) {
            try {
                await this.onCSVBatch(job, upload, batch);
            } catch (e) {
                error = e;
                break;
            }
        }

        if (error) {
            await job.moveToFailed(error)
        }
        else {
            try {
                await this.onCSVComplete(job.data.uid, job.data.authorityID);
            } catch (e) {
                await job.moveToFailed(e);
            }
        }
    }

    @OnQueueCompleted()
    async queueCompletedHandler(job: Job) {
        this.logger.log(`Upload complete for taxa authority ID ${job.data.authorityID}`);
    }

    @OnQueueFailed()
    async queueFailedHandler(job: Job, err: Error) {
        this.logger.error(JSON.stringify(err));
        try {
            return this.onCSVComplete(job.data.uid, job.data.authorityID);
        } catch (e) {
            this.logger.error(`Error updating statistics: ${JSON.stringify(e)}`);
        }
        await this.notifications.save({ uid: job.data.uid, message: `Upload failed: ${JSON.stringify(err)}` });
    }

    /**
     * Process a taxonomy CSV file
     * Read through all the records updating taxonomy-related tables as needed
     * @param job - the job to process (with the file information
     * @parmm upload - the upload process
     * @param batch - batch of taxon records
     * @return nothing
     */
    private async onCSVBatch(job: Job<TaxonomyUploadJob>, upload: TaxonomyUpload, batch: DeepPartial<Taxon>[]) {
        // list of all the updates to do to taxon records
        const allTaxonUpdates = []
        const skippedTaxons = []

        // list of all the updates to do to status records
        const allStatusUpdates = []
        const skippedStatuses = []

        // Build a list of all the potential field names
        const entityColumns = this.taxonRepo.metadata.columns
        const statusColumns = this.statusRepo.metadata.columns
        // For now, we do not care about common names
        //const vernacularColumns = this.vernacularRepo.metadata.columns
        // Do not believe we need anything from the taxon units table
        //const rankColumns = this.rankRepo.metadata.columns
        const artificialColumns = ["AcceptedTaxonName", "ParentTaxonName", "RankName"]

        // Get all of the potential ranks
        const allRanks = await this.rankRepo.find({})
        const rankIDToNameMap: Map<number, string> = new Map()
        const rankIDToKingdomMap: Map<number, string> = new Map()
        const rankAndKingdomToIDMap: Map<string, number> = new Map()
        const rankNameToIDMap: Map<string, number> = new Map()
        const rankSeparator = ':'
        allRanks.forEach((rank) => {
            rankIDToNameMap.set(rank.rankID, rank.rankName)
            rankAndKingdomToIDMap.set(rank.rankName + rankSeparator + rank.kingdomName, rank.rankID)
        })

        // Map field names to tables
        const fieldToTable: Map<string, string> = new Map()
        entityColumns.forEach((field) => {
            fieldToTable.set(field.propertyName, "taxon")
        })

        // If it is a taxon field, then don't let it be a status field
        statusColumns.forEach((field) => {
            if (!fieldToTable.has(field.propertyName)) {
                fieldToTable.set(field.propertyName, "status")
            }
        })
        artificialColumns.forEach((field) => {
            if (!fieldToTable.has(field)) {
                fieldToTable.set(field, "artificial")
            }
        })


        // Process the taxon info first
        for (const row of batch) {
            const taxonData = {}

            // Flag to keep track if we skip this row
            let skip= false

            // foreach field
            for (const [csvField, dbField] of Object.entries(upload.fieldMap)) {

                // Check to see if csvField is mapped to a db field
                if (!dbField) {
                    continue
                }
                // Check to make sure that it maps to a database table
                if (!fieldToTable.has(dbField)) {
                    continue
                }

                let csvValue = row[csvField]

                if (fieldToTable.get(dbField) == "artificial") {

                    if (dbField == "RankName") {
                        const kingdomName = row["Kingdom"]
                        const value = csvValue + rankSeparator + kingdomName
                        // Map rank name to rank ID
                        if (rankAndKingdomToIDMap.has(value)) {
                            // Found the name use the ID
                            csvValue = rankAndKingdomToIDMap.get(value)
                        } else {
                            skip = true
                            this.logger.warn(`Taxon does not have a matching rank! Skipping...`)
                            continue
                        }
                        taxonData["rankID"] = csvValue == '' ? null : csvValue
                    }
                } else {
                    // Skip if the field is not a taxon table field
                    if (!(fieldToTable.get(dbField) == "taxon")) {
                        continue
                    }

                    taxonData[dbField] = csvValue === '' ? null : csvValue
                }
            }

            // Check that the required fields are present
            // Taxon needs a scientific name
            if (!taxonData["scientificName"]) {
                skip = true
            }
            // Taxon needs a rank id
            if (!taxonData["rankID"]) {
                skip = true
            }

            /*
            const dbIDField = upload.fieldMap[upload.uniqueIDField]
            const uniqueValue = taxonData[dbIDField]

            // Without a unique value for the row, skip it
            if (!uniqueValue) {
                continue;
            }
             */

            // Let's try to match the taxon with information about the taxon to
            // things in the database
            // If we have a taxon id then let's use that
            let dbTaxon = null
            if (taxonData["id"]) {
                /*
                const dbTaxon = await this.taxonRepo.findOne({
                    [dbIDField]: uniqueValue
                })
                 */

                // Look for the taxon with this id
                dbTaxon = await this.taxonRepo.findOne({
                    id: taxonData["id"]
                })
            } else {
                // Meed to match
                // First let's try to match just on scientific name
                const testTaxons = await this.taxonRepo.find({
                    where: {scientificName: taxonData["scientificName"]}
                })

                if (testTaxons.length == 0) {
                    // A new scientific name, we'll insert
                } else if (testTaxons.length == 1) {
                    // An existing unique name, we'll update
                    dbTaxon = testTaxons[0]
                } else {
                    const whereClause = {scientificName: taxonData["scientificName"]}

                    // Does it have a kingdom name?
                    if (taxonData["kingdomName"]) {
                        whereClause["kingdomName"] = taxonData["kingdomName"]
                    }
                    // Does it have an author?
                    if (taxonData["author"]) {
                        whereClause["author"] = taxonData["author"]
                    }

                    const moreTestTaxons = await this.taxonRepo.find({
                        where: whereClause
                    })

                    if (moreTestTaxons.length == 0) {
                        // A new scientific name, we'll insert
                    } else if (moreTestTaxons.length == 1) {
                        // An existing unique name, we'll update
                        dbTaxon = testTaxons[0]
                    } else {
                        // Still ambiguous
                        skip = true
                    }
                }
            }

            // We need to get rid of this; If it's already in the db, then
            // dbTaxon has it; If it's not, we'll generate a new one
            // Don't need to delete
            // delete taxonData['id']

            if (skip) {
                skippedTaxons.push(taxonData)
            } else {
                // Update
                if (dbTaxon) {
                    for (const [k, v] of Object.entries(taxonData)) {
                        if (k in dbTaxon) {
                            dbTaxon[k] = v;
                        }
                    }
                    allTaxonUpdates.push(dbTaxon);
                }
                // Insert
                else {
                    const taxon = this.taxonRepo.create(taxonData)
                    allTaxonUpdates.push(taxon)
                }
            }

        }

        await this.taxonRepo.save(allTaxonUpdates)
        this.processed += allTaxonUpdates.length

        // Now do the taxonomic status
        for (const row of batch) {
            const statusData = {}

            for (const [csvField, dbField] of Object.entries(upload.fieldMap)) {
                if (!dbField) {
                    continue
                }
                if (!fieldToTable.has(dbField)) {
                    continue
                }
                if (!(fieldToTable.get(dbField) == "status")) {
                    continue
                }
                let csvValue = row[csvField]
                if (fieldToTable.get(dbField) == "artificial") {
                    // "AcceptedTaxonName", "ParentTaxonName",
                    if (dbField == "ParentTaxonName") {
                        // Map taxon name to taxon ID
                        const taxon = await this.taxonRepo.findOne({ scientificName: csvValue })
                        if (taxon) {
                            // Found the name use the ID
                            csvValue = taxon.id
                        } else {
                            this.logger.warn(`Parent taxon name does not have a matching taxon! Skipping...`)
                            continue
                        }
                        statusData["parentTaxonID"] = csvValue == '' ? null : csvValue
                    } else if (dbField == "AcceptedTaxonName") {
                        // Map taxon name to taxon ID
                        const taxon = await this.taxonRepo.findOne({ scientificName: csvValue })
                        if (taxon) {
                            // Found the name use the ID
                            csvValue = taxon.id
                        } else {
                            this.logger.warn(`Parent taxon name does not have a matching taxon! Skipping...`)
                            continue
                        }
                        statusData["taxonIDAccepted"] = csvValue == '' ? null : csvValue
                    } else {
                        continue
                    }
                } else {
                    statusData[dbField] = csvValue === '' ? null : csvValue
                }

                const dbIDField = upload.fieldMap[upload.uniqueIDField]
                const uniqueValue = statusData[dbIDField]

                // Without a unique value for the row, skip it
                if (!uniqueValue) {
                    continue;
                }

                // Hard code based on job's collection ID
                //taxonData['collectionID'] = job.data.collectionID;

                const dbTaxon = await this.statusRepo.findOne({
                    [dbIDField]: uniqueValue
                });

                // We need to get rid of this; If it's already in the db, then
                // dbTaxon has it; If it's not, we'll generate a new one
                delete statusData['id']

                // Update
                if (dbTaxon) {
                    for (const [k, v] of Object.entries(statusData)) {
                        if (k in dbTaxon) {
                            dbTaxon[k] = v
                        }
                    }
                    allStatusUpdates.push(dbTaxon)
                }
                // Insert
                else {
                    const taxon = this.statusRepo.create(statusData)
                    allStatusUpdates.push(taxon)
                }
            }

            let logMsg = `Processing uploads for taxa authority ID ${job.data.authorityID} `
            logMsg += `(${new Intl.NumberFormat().format(this.processed)} processed)...`
            this.logger.log(logMsg)
        }
    }

    private async onCSVComplete(uid: number, authorityID: number) {
        await this.notifications.save({
            uid,
            message: `Your upload to taxa authority ID ${authorityID} has completed`
        })
    }
}
