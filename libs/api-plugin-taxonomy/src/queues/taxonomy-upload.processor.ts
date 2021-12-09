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
import { TaxonomicEnumTreeService } from '../taxonomicEnumTree/taxonomicEnumTree.service';

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
        @Inject(TaxonomyUpload.PROVIDER_ID)
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
        private readonly taxaEnumTree: Repository<TaxaEnumTreeEntry>,
        private readonly taxaEnumTreeService: TaxonomicEnumTreeService) { }

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
        const taxonUpdates : Taxon[] = []
        const skippedTaxonsDueToMulitpleMatch = []
        const skippedTaxonsDueToMismatchRank = []
        const skippedTaxonsDueToMissingName = []

        // list of all the updates to do to status records
        const statusUpdates : TaxonomicStatus[] = []
        const skippedStatusesDueToMultipleMatch = []
        const skippedStatusesDueToAcceptedMismatch = []
        const skippedStatusesDueToParentMismatch = []
        const skippedStatusesDueToTaxonMismatch = []

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

        // There are also some artificial (not present in database) fields
        artificialColumns.forEach((field) => {
            if (!fieldToTable.has(field)) {
                fieldToTable.set(field, "artificial")
            }
        })

        // Map the "good" taxon update row number to the batch row number
        let batchRowNumber = -1
        let taxonRowNumber = 0
        const taxonRowToBatchRow : Map<number,number> = new Map()

        // We first need the kingdomName
        // foreach field
        let kingdomInRowName = null
        for (const [csvField, dbField] of Object.entries(upload.fieldMap)) {
            if (dbField == "kingdomName") {
                kingdomInRowName = csvField
            }
        }

        // Must have a kingdomName field
        if (!kingdomInRowName) {
            this.logger.warn(`Mapping is missing a field for kingdom name! Exiting...`)
            return // [TODO should throw error]
        }

        // Process the taxon info first
        for (const row of batch) {
            batchRowNumber += 1
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

                // Check if field is an introduced one
                if (fieldToTable.get(dbField) == "artificial") {

                    // For taxons we are interested in mapping the rankname to an id
                    if (dbField == "RankName") {
                        const kingdomName = row[kingdomInRowName]
                        const value = csvValue + rankSeparator + kingdomName
                        // Map rank name to rank ID
                        if (rankAndKingdomToIDMap.has(value)) {
                            // Found the name use the ID
                            csvValue = rankAndKingdomToIDMap.get(value)
                        } else {
                            skip = true
                            skippedTaxonsDueToMismatchRank.push(row)
                            this.logger.warn(`Taxon does not have a matching rank! Skipping...` + value)
                            continue
                        }
                        taxonData["rankID"] = csvValue == '' ? null : csvValue
                    } else {
                        // Skip this field
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
                skippedTaxonsDueToMissingName.push(row)
                this.logger.warn(`Taxon is missing a scientific name! Skipping...`)
                skip = true
                continue
            }
            // Taxon needs a rank id
            if (!taxonData["rankID"]) {
                skippedTaxonsDueToMismatchRank.push(row)
                this.logger.warn(`Taxon lacks a rank ID (no match in the database to rank name if present)! Skipping...`)
                skip = true
                continue
            }

            // Let's try to match the taxon with information about the taxon to
            // things in the database
            // If we have a taxon id then let's use that
            let dbTaxon = null

            if (taxonData["id"]) {
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

                // See how many things we got back
                if (testTaxons.length == 0) {
                    // A new scientific name, we'll insert
                } else if (testTaxons.length == 1) {
                    // An existing unique name, we'll update
                    dbTaxon = testTaxons[0]
                } else {

                    // Expand the match to include kingdom name and author if present
                    const whereClause = {scientificName: taxonData["scientificName"]}

                    // Does it have a kingdom name?
                    if (taxonData["kingdomName"]) {
                        whereClause["kingdomName"] = taxonData["kingdomName"]
                    }
                    // Does it have an author?
                    if (taxonData["author"]) {
                        whereClause["author"] = taxonData["author"]
                    }

                    // Fetch the expanded search
                    const moreTestTaxons = await this.taxonRepo.find({
                        where: whereClause
                    })

                    // See how many we got
                    if (moreTestTaxons.length == 0) {
                        // A new scientific name, we'll insert
                    } else if (moreTestTaxons.length == 1) {
                        // An existing unique name, we'll update
                        dbTaxon = testTaxons[0]
                    } else {
                        // Still ambiguous
                        skippedTaxonsDueToMulitpleMatch.push(row)
                        skip = true
                    }
                }
            }

            if (skip) {
                // Should already be pushed into a skipped list
            } else {
                // Do we need to insert?
                if (!dbTaxon) {
                    // Need to insert, create a new one
                    dbTaxon = this.taxonRepo.create(taxonData)
                }
                // Update with taxonData information
                for (const [k, v] of Object.entries(taxonData)) {
                    if (k in dbTaxon) {
                        dbTaxon[k] = v;
                    }
                }
                taxonUpdates.push(dbTaxon)
                taxonRowToBatchRow.set(taxonRowNumber++, batchRowNumber)
            }

        }

        /*
        console.log(" number of taxon updates " + taxonUpdates.length)
        console.log(" number of skipped due to multiple match " + skippedTaxonsDueToMulitpleMatch.length)
        console.log(" number of skipped due to mismatch rank " + skippedTaxonsDueToMismatchRank.length)
        console.log(" number of skipped due to missing name " + skippedTaxonsDueToMissingName.length)
         */

        // Save all of the taxons
        await this.taxonRepo.save(taxonUpdates)
        this.processed += taxonUpdates.length

        // Now do the taxonomic status, iterating through the taxonUpdates
        const statusRankMap = new Map()
        for (let taxonRowNumber = 0; taxonRowNumber < taxonUpdates.length; taxonRowNumber++) {
            const taxonData = taxonUpdates[taxonRowNumber]
            const statusData = {}
            const row = batch[taxonRowToBatchRow.get(taxonRowNumber)]
            let dbStatus = null

            // Flag to keep track if we skip this row
            let skip= false

            let taxons = []

            // Does it have an id
            if (taxonData.id) {
                taxons = await this.taxonRepo.find({
                    where: {  id: taxonData.id }
                })
            } else {
                // First, let's load the taxon record to get the taxon id
                const whereClause = {scientificName: taxonData["scientificName"]}

                // Does it have a kingdom name?
                if (taxonData["kingdomName"]) {
                    whereClause["kingdomName"] = taxonData["kingdomName"]
                }
                // Does it have an author?
                if (taxonData["author"]) {
                    whereClause["author"] = taxonData["author"]
                }

                taxons = await this.taxonRepo.find({
                    where: whereClause
                })
            }

            // Did we find a taxon?
            if (taxons.length != 1) {
                // Found zero or several
                skippedStatusesDueToTaxonMismatch.push(row)
                this.logger.warn(`Taxon status check, taxon has multiple matches or no match in the database! Skipping...`)
                skip = true
                continue
            }

            // Have a taxon match, let's get it
            const taxon = taxons[0]

            // Go through the fields in the row
            for (const [csvField, dbField] of Object.entries(upload.fieldMap)) {

                if (!dbField) {
                    continue
                }

                if (!fieldToTable.has(dbField)) {
                    continue
                }

                let csvValue = row[csvField]


                if (fieldToTable.get(dbField) == "artificial") {
                    // "AcceptedTaxonName", "ParentTaxonName",
                    if (dbField == "ParentTaxonName" || dbField == "AcceptedTaxonName") {
                        // Map taxon name to taxon ID
                        const whereClause = {scientificName: taxonData["scientificName"]}

                        // Does it have a kingdom name?  Use it if it does
                        if (taxonData["kingdomName"]) {
                            whereClause["kingdomName"] = taxonData["kingdomName"]
                        }

                        const taxons = await this.taxonRepo.find({
                            where: whereClause
                        })
                        if (taxons.length == 0) {
                            // Not found, skip
                            skip = true
                            if (dbField == "ParentTaxonName") {
                                skippedStatusesDueToParentMismatch.push(row)
                                this.logger.warn(`Parent taxon name does not have a matching taxon! Skipping...`)
                            } else {
                                skippedStatusesDueToAcceptedMismatch.push(row)
                                this.logger.warn(`Accepted taxon name does not have a matching taxon! Skipping...`)
                            }
                            continue
                        } else if (taxons.length == 1) {
                            // Found one match
                            csvValue = taxons[0].id
                        } else {
                            // Found more than one match
                            skip = true
                            if (dbField == "ParentTaxonName") {
                                skippedStatusesDueToParentMismatch.push(row)
                                this.logger.warn(`Parent taxon name has more than one matching taxon! Skipping...`)
                            } else {
                                skippedStatusesDueToAcceptedMismatch.push(row)
                                this.logger.warn(`Accepted taxon has more than one matching taxon! Skipping...`)
                            }
                            continue
                        }
                    }
                    if (dbField == "ParentTaxonName") {
                        statusData["parentTaxonID"] = csvValue == '' ? null : csvValue
                    } else /*if (dbField == "AcceptedTaxonName") */ {
                        statusData["taxonIDAccepted"] = csvValue == '' ? null : csvValue
                    }
                }

                if (!(fieldToTable.get(dbField) == "status")) {
                    continue
                }

                // Copy this field it is part of the status data
                statusData[dbField] = csvValue === '' ? null : csvValue
            }

            //console.log(" All done with field mapping, checking statuses " + taxon.id)
            // Look for the statuses for this taxon
            let statuses = []

            statuses = await this.statusRepo.find({
                where: {
                    taxonID: taxon.id,
                    taxonAuthorityID: job.data.authorityID
                }
            })

            //console.log(" Statues found " + statuses.length)

            if (statuses.length == 0) {
                // No status yet, add it
            } else if (statuses.length == 1) {
                // Update the found status
                dbStatus = statuses[0]
            } else {
                // Found more than one status
                skip = true
                skippedStatusesDueToMultipleMatch.push(row)
                this.logger.warn(`Taxon is in conflict, has multiple statuses, need to resolve! Skipping...`)
                continue
            }

            // Update
            if (skip) {
                // Skipped, it is already in one of the skipped queues
            } else {
                if (!dbStatus) {
                    // Create
                    dbStatus = this.statusRepo.create(statusData)
                }

                // Set the taxon id explicitly
                dbStatus.taxonID = taxon.id

                // Set the taxonomic authority explicitly
                dbStatus.taxonAuthorityID = job.data.authorityID

                for (const [k, v] of Object.entries(statusData)) {
                    if (k in dbStatus) {
                        dbStatus[k] = v
                    }
                }

                /*
                console.log("updating status")
                for (const [k, v] of Object.entries(dbStatus)) {
                    console.log(" status field " + k + " = " + v)
                }
                 */

                statusUpdates.push(dbStatus)
                // Figure out the rank for this status update
                if (!statusRankMap.has(taxon.rankID)) {
                    statusRankMap.set(taxon.rankID,[])
                }
                statusRankMap.get(taxon.rankID).push(dbStatus)
            }
        }
        // Save all of the statuses

        await this.statusRepo.save(statusUpdates)
        this.processed += statusUpdates.length

        // Now move the taxons in order by rank from top to bottom
        const keys = []
        for (const [k, v] of Object.entries(statusRankMap)) {
            keys.push(k)
        }
        keys.sort((a,b) => { return a-b }).forEach((key) => {
          statusRankMap.get(key).forEach((status) => {
              this.taxaEnumTreeService.moveTaxon(status.taxonID,status.taxonAuthorityID,status.parentTaxonID)
          })
        })

        /*
        console.log(" number of status updates " + statusUpdates.length)
        console.log(" number of skipped due to accepted mismatch " + skippedStatusesDueToAcceptedMismatch.length)
        console.log(" number of skipped due to multiple match " + skippedStatusesDueToMultipleMatch.length)
        console.log(" number of skipped due to parent mismatch " + skippedStatusesDueToParentMismatch.length)
        console.log(" number of skipped due to taxon mismatch " + skippedStatusesDueToTaxonMismatch.length)
         */

        let logMsg = `Processing uploads for taxa authority ID ${job.data.authorityID} `
        logMsg += `(${new Intl.NumberFormat().format(taxonUpdates.length)} taxons processed and`
        logMsg += `${new Intl.NumberFormat().format(statusUpdates.length)} statuses processed)...`
        this.logger.log(logMsg)
    }

    private async onCSVComplete(uid: number, authorityID: number) {
        await this.notifications.save({
            uid,
            message: `Your upload to taxa authority ID ${authorityID} has completed`
        })
    }
}
