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
import { DeepPartial, In, IsNull, Repository } from 'typeorm';
import { QUEUE_ID_TAXONOMY_UPLOAD } from './taxonomy-upload.queue';
import { csvIteratorWithTrimValues, objectIterator } from '@symbiota2/api-common';
import { TaxonService } from '../taxon/taxon.service';
import { TaxonomicEnumTreeService } from '../taxonomicEnumTree/taxonomicEnumTree.service';
import * as fs from 'fs';
import { StorageService } from '@symbiota2/api-storage';

export interface TaxonomyUploadJob {
    uid: number
    authorityID: number
    uploadID: number
    taxonUpdates : Taxon[]
    skippedTaxonsDueToMultipleMatch
    skippedTaxonsDueToMismatchRank
    skippedTaxonsDueToMissingName

    // list of all the updates to do to status records
    statusUpdates : TaxonomicStatus[]
    skippedStatusesDueToMultipleMatch
    skippedStatusesDueToAcceptedMismatch
    skippedStatusesDueToParentMismatch
    skippedStatusesDueToTaxonMismatch
}

@Processor(QUEUE_ID_TAXONOMY_UPLOAD)
export class TaxonomyUploadProcessor {
    private processed = 0
    private static MAX_SKIPPED_BUFFER_SIZE = 1000 // Limit of how many skipped records of any type we want to keep
    private readonly logger = new Logger(TaxonomyUploadProcessor.name)
    separator = ":"
    taxonFilesPath = "./data/uploads/taxa/taxon"

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
        private readonly taxaEnumTreeService: TaxonomicEnumTreeService,
        private readonly storageService: StorageService) { }

    // TODO: Wrap in a transaction? Right now each chunk goes straight to the database until a failure occurs
    @Process()
    async upload(job: Job<TaxonomyUploadJob>): Promise<void> {
        // Get the upload info
        const upload = await this.uploads.findOne(job.data.uploadID)
        if (!upload) {
            return
        }
        this.logger.log(`Upload of '${upload.filePath}' started...`)

        // Get all of the potential ranks
        const allRanks = await this.rankRepo.find({})
        const kingdomAndRankToIDMap: Map<string, number> = new Map()
        allRanks.forEach((rank) => {
            kingdomAndRankToIDMap.set(rank.kingdomName + this.separator + rank.rankName, rank.rankID)
        })

        // Process the csv file splitting it into batches that will be processed by rank
        let error: Error = null
        const fileMap = new Map()
        for await (const batch of csvIteratorWithTrimValues<DeepPartial<Taxon>>(upload.filePath)) {
            try {
                await this.splitBatchByRank(kingdomAndRankToIDMap, fileMap, job, upload, batch);
            } catch (e) {
                error = e;
                break;
            }
        }

        // Now close all the streams
        const keys =[ ...fileMap.keys() ].sort((a,b) => a-b)
        keys.forEach((key) => {
            fileMap.get(key).end()
        })

        // Update the job status
        upload.uniqueIDField = "started"
        await this.uploads.save(upload)

        // Now let's process all the ranks
        if (error) {
            this.logger.error(" Queue processing failed ")
            await job.moveToFailed(error)
        } else {
            // this.logger.log(" keys length " + keys.length)
            for (let key of keys) {
                // this.logger.log("TEST doing " + key)
                error = await this.processRankFile(key, job, upload)
                // this.logger.log("TEST rank file processed " + error)
            }
            if (error) {
                this.logger.error(" Error detected in processing rank file")
                await job.moveToFailed(error)
            }
        }

        if (error) {
            this.logger.error(" Error detected in processing rank file")
            await job.moveToFailed(error)
        }
        else {
            try {
                await this.onCSVComplete(job.data.uid, job.data.authorityID)
                // Update the job status
                await this.writeBadRows(job)
                upload.uniqueIDField = "done"
                await this.uploads.save(upload)
            } catch (e) {
                this.logger.error(" Error detected in processing rank file")
                await job.moveToFailed(e);
            }
        }
    }

    private async writeBadRows(job) {
        await this.writeRows(job.data.skippedTaxonsDueToMultipleMatch, TaxonService.skippedTaxonsDueToMultipleMatchPath)
        await this.writeRows(job.data.skippedTaxonsDueToMismatchRank, TaxonService.skippedTaxonsDueToMismatchRankPath)
        await this.writeRows(job.data.skippedTaxonsDueToMissingName, TaxonService.skippedTaxonsDueToMissingNamePath)

        // list of all the updates to do to status records
        await this.writeRows(job.data.skippedStatusesDueToMultipleMatch, TaxonService.skippedStatusesDueToMultipleMatchPath)
        await this.writeRows(job.data.skippedStatusesDueToAcceptedMismatch, TaxonService.skippedStatusesDueToAcceptedMismatchPath)
        await this.writeRows(job.data.skippedStatusesDueToParentMismatch, TaxonService.skippedStatusesDueToParentMismatchPath)
        await this.writeRows(job.data.skippedStatusesDueToTaxonMismatch, TaxonService.skippedStatusesDueToTaxonMismatchPath)
    }

    private async writeRows(a, path) {
        await this.storageService.putData(TaxonService.s3Key(path), this.convertToCSV(a))
    }

    private convertToCSV(objArray) {
        const array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray
        let str = ''

        for (let i = 0; i < array.length; i++) {
            let line = ''
            for (let index in array[i]) {
                if (line != '') line += ','

                line += array[i][index]
            }

            str += line + '\r\n'
        }

        return str
    }


    private async processRankFile(key, job, upload) {
        // this.logger.log(" TEST doing processRankFile " + this.taxonFilesPath + key)
        try {
            for await (const batch of objectIterator<DeepPartial<Taxon>>(this.taxonFilesPath + key)) {
                try {
                    // this.logger.log("TEST doing a batch")
                    await this.onJSONBatch(job, upload, batch);
                    // this.logger.log("TEST done with batch")
                } catch (e) {
                    // this.logger.error("erros is ")
                    this.logger.error(`Error processing rank file: ${JSON.stringify(e)}`)
                    return e
                }
            }
            // this.logger.log(" TEST batches done " + this.taxonFilesPath + key)
        } catch (e) {
            this.logger.error(`Error reading batch file : ${JSON.stringify(e)}`)
            return e
        }

        return null
    }

    @OnQueueCompleted()
    async queueCompletedHandler(job: Job) {
        this.logger.log(`Upload complete for taxa authority ID ${job.data.authorityID}`);
    }

    @OnQueueFailed()
    async queueFailedHandler(job: Job, err: Error) {
        this.logger.error("Queue failed " + JSON.stringify(err));
        await this.notifications.save({ uid: job.data.uid, message: `Upload failed: ${JSON.stringify(err)}` });
        try {
            return this.onCSVComplete(job.data.uid, job.data.authorityID);
        } catch (e) {
            this.logger.error(`Error updating statistics: ${JSON.stringify(e)}`);
        }
    }

    /**
     * Write each row to a new file based on the rank id
     * @param job - the job to process (with the file information
     * @parmm upload - the upload process
     * @param batch - batch of taxon records
     * @return nothing
     */
    private async splitBatchByRank(rankMap: Map<string, number>, fileMap : Map<number, any>,  job, upload: TaxonomyUpload, batch: DeepPartial<Taxon>[]) {
        // We first need the kingdomName and the rankName fields
        let kingdomInRowName = null
        let rankInRowName = null
        for (const [csvField, dbField] of Object.entries(upload.fieldMap)) {
            if (dbField == "kingdomName") {
                kingdomInRowName = csvField
            }
            if (dbField == "RankName") {
                rankInRowName = csvField
            }
        }

        // Must have a kingdomName field
        if (!kingdomInRowName) {
            this.logger.error(`Mapping is missing a field for kingdom name! Exiting...`)
            throw new Error('Missing kingdom name field')
        }
        // Must have a rankName field
        if (!rankInRowName) {
            this.logger.error(`Mapping is missing a field for rank name! Exiting...`)
            throw new Error('Missing rank name field')
        }

        // Process each row in batch
        for (const row of batch) {
            const rankValue = row[rankInRowName]
            const kingdomValue = row[kingdomInRowName]
            const key = kingdomValue + this.separator + rankValue

            if (!rankMap.has(key)) {
                // Error no rank for this row
                this.logger.error(`Row is missing a matching rank and kingdom ${key} skipping...`)
                const skippedTaxonsDueToMismatchRank = job.data.skippedTaxonsDueToMismatchRank
                if (skippedTaxonsDueToMismatchRank.length < TaxonomyUploadProcessor.MAX_SKIPPED_BUFFER_SIZE) {
                    skippedTaxonsDueToMismatchRank.push(row)
                }
                continue
                //throw new Error('No matching rank and kingdom name')
            }
            // Open the file if it does not exist
            const file = rankMap.get(key)
            try {
                if (!fileMap.has(file)) {
                    let writeStream = fs.createWriteStream(this.taxonFilesPath + file)
                    fileMap.set(file,writeStream)
                }
                const writeStream = fileMap.get(file)
                writeStream.write(JSON.stringify(row) + "\n")
            } catch (e) {
                this.logger.error('Error writing to file' + e)
                throw new Error('Error writing to file')
            }
        }
    }

    /**
     * Process a taxonomy CSV file
     * Read through all the records updating taxonomy-related tables as needed
     * @param job - the job to process (with the file information
     * @parmm upload - the upload process
     * @param batch - batch of taxon records
     * @return nothing
     */
    private async onJSONBatch(job: Job<TaxonomyUploadJob>, upload: TaxonomyUpload, batch: DeepPartial<Taxon>[]) {

        // list of all the updates to do to taxon records
        const taxonUpdates: Taxon[] = []
        const changedTaxons: Taxon[] = []
        const skippedTaxonsDueToMultipleMatch = job.data.skippedTaxonsDueToMultipleMatch
        const skippedTaxonsDueToMismatchRank = job.data.skippedTaxonsDueToMismatchRank
        const skippedTaxonsDueToMissingName = job.data.skippedTaxonsDueToMissingName

        // list of all the updates to do to status records
        const statusUpdates: TaxonomicStatus[] = []
        const changedStatuses: TaxonomicStatus[] = []
        const skippedStatusesDueToMultipleMatch = job.data.skippedStatusesDueToMultipleMatch
        const skippedStatusesDueToAcceptedMismatch = job.data.skippedStatusesDueToAcceptedMismatch
        const skippedStatusesDueToParentMismatch = job.data.skippedStatusesDueToParentMismatch
        const skippedStatusesDueToTaxonMismatch = job.data.skippedStatusesDueToTaxonMismatch

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
        allRanks.forEach((rank) => {
            rankIDToNameMap.set(rank.rankID, rank.rankName)
            rankAndKingdomToIDMap.set(rank.rankName + this.separator + rank.kingdomName, rank.rankID)
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
        let goodRowNumber = -1
        let taxonRowNumber = 0
        const taxonRowToGoodRow: Map<number, number> = new Map()

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
            this.logger.error(`Mapping is missing a field for kingdom name! Exiting...`)
            return []
        }

        // Process the taxon info first
        // We'll do it in batches to minimize query time
        // const goodRowsMap = new Map<string,any[]>()
        const goodRows = []
        const scinames = []

        for (const row of batch) {
            const taxonData = {}

            // Flag to keep track if we skip this row
            let skip = false

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
                        const value = csvValue + this.separator + kingdomName
                        // Map rank name to rank ID
                        if (rankAndKingdomToIDMap.has(value)) {
                            // Found the name use the ID
                            csvValue = rankAndKingdomToIDMap.get(value)
                        } else {
                            skip = true
                            if (skippedTaxonsDueToMismatchRank.length < TaxonomyUploadProcessor.MAX_SKIPPED_BUFFER_SIZE) {
                                skippedTaxonsDueToMismatchRank.push(row)
                            }
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
                if (skippedTaxonsDueToMissingName.length < TaxonomyUploadProcessor.MAX_SKIPPED_BUFFER_SIZE) {
                    skippedTaxonsDueToMissingName.push(row)
                }
                this.logger.warn(`Taxon is missing a scientific name! Skipping...`)
                skip = true
                continue
            }
            // Taxon needs a rank id
            if (!taxonData["rankID"]) {
                if (skippedTaxonsDueToMismatchRank.length < TaxonomyUploadProcessor.MAX_SKIPPED_BUFFER_SIZE) {
                    skippedTaxonsDueToMismatchRank.push(row)
                }
                this.logger.warn(`Taxon lacks a rank ID (no match in the database to rank name if present)! Skipping...`)
                skip = true
                continue
            }

            // Survived the row
            if (!skip) {
                //const name = taxonData["scientificName"]
                //if (!goodRowsMap.has(name)) {
                //    goodRowsMap.set(name,[])
                //}
                //const a = goodRowsMap.get(name)
                //a.push(taxonData)
                goodRows.push(row)
                scinames.push(taxonData["scientificName"])
            }
        }

        // Do the DB query
        if (scinames.length == 0) {
            // Nothing to process
            return []
        }

        const foundTaxons = await this.taxonRepo.find({
            where: { scientificName: In(scinames) }
        })

        // Map the found taxons to list of taxons organized by scientific name
        const foundMap = new Map<string,any[]>()
        for (const taxon of foundTaxons) {
            const name = taxon["scientificName"]
            if (!foundMap.has(name)) {
                foundMap.set(name,[])
            }
            const a = foundMap.get(name)
            a.push(taxon)
        }

        // Run through the batch and match rows
        for (const taxonData of goodRows) {
            goodRowNumber += 1

            // Flag to keep track if we skip this row
            let skip = false

            // Let's try to match the taxon with information about the taxon to
            // things in the database
            // If we have a taxon id then let's use that
            let dbTaxon = null

            const name = taxonData["scientificName"]

            // Meed to match
            // First let's try to match just on scientific name
            let testTaxons = []
            if (foundMap.has(name)) {
                testTaxons = foundMap.get(name)
            }

            // See how many things we got back
            if (testTaxons.length == 0) {
                // A new scientific name, we'll insert
            } else if (testTaxons.length == 1) {
                // An existing unique name, we'll update
                dbTaxon = testTaxons[0]
            } else {

                // Expand the match to include kingdom name and author if present
                let moreTestTaxons = testTaxons

                // Does it have an author?
                if (moreTestTaxons.length > 1 && taxonData["author"]) {
                    moreTestTaxons = moreTestTaxons.filter(a => a["author"] = taxonData["author"])
                }
                // Does it have a rankID?
                if (moreTestTaxons.length > 1 && taxonData["rankID"]) {
                    moreTestTaxons = moreTestTaxons.filter(a => a["rankID"] = taxonData["rankID"])
                }
                // Does it have a kingdom name?
                if (moreTestTaxons.length > 1 && taxonData["kingdomName"]) {
                    moreTestTaxons = moreTestTaxons.filter(a => a["kingdomName"] = taxonData["kingdomName"])
                }

                // See how many we got
                if (moreTestTaxons.length == 0) {
                    // A new scientific name, we'll insert
                } else if (moreTestTaxons.length == 1) {
                    // An existing unique name, we'll update
                    dbTaxon = moreTestTaxons[0]
                } else {
                    // Still ambiguous
                    if (skippedTaxonsDueToMultipleMatch.length < TaxonomyUploadProcessor.MAX_SKIPPED_BUFFER_SIZE) {
                        skippedTaxonsDueToMultipleMatch.push(taxonData)
                    }
                    this.logger.warn("Skipping row due to multiple mismatch")
                    skip = true
                }
            }

            if (skip) {
                // Should already be pushed into a skipped list
            } else {
                let newRecordFlag = false
                let changed = false
                // Do we need to insert?
                if (!dbTaxon) {
                    // Need to insert, create a new one
                    dbTaxon = this.taxonRepo.create(taxonData)
                    newRecordFlag = true
                } else {
                    for (const [k, v] of Object.entries(taxonData)) {
                        if (k in dbTaxon) {
                            // this.logger.log(" k and stuff " + v + " other " + dbTaxon[k])
                            if (dbTaxon[k] != v) {
                                dbTaxon[k] = v
                                changed = true
                            }
                        }
                    }
                }
                // Update with taxonData information
                taxonUpdates.push(dbTaxon)
                taxonRowToGoodRow.set(taxonRowNumber++, goodRowNumber)
                // Only add to the change queue if actually changed
                if (changed || newRecordFlag) {
                    changedTaxons.push(dbTaxon)
                }
            }

        }

        /*
        for (let [name, testTaxons] of foundMap) {
            let skip = false
            let dbTaxon = null

            // See how many things we got back
            if (testTaxons.length == 0) {
                // A new scientific name, we'll insert
            } else if (testTaxons.length == 1) {
                // An existing unique name, we'll update
                dbTaxon = testTaxons[0]
            } else {

                for (const goodTaxon of goodRowsMap.get(name)) {
                    for (const foundTaxon of testTaxons) {

                    }
                }

                // Does it have an author?
                if (taxonData["author"]) {
                    whereClause["author"] = taxonData["author"]
                }
                // Does it have a rankID?
                if (taxonData["rankID"]) {
                    whereClause["rankID"] = taxonData["rankID"]
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
                    dbTaxon = moreTestTaxons[0]
                } else {
                    // Still ambiguous
                    if (skippedTaxonsDueToMultipleMatch.length < TaxonomyUploadProcessor.MAX_SKIPPED_BUFFER_SIZE) {
                        skippedTaxonsDueToMultipleMatch.push(row)
                    }
                    this.logger.warn("Skipping row due to multiple mismatch")
                    skip = true
                }
            }


            if (skip) {
                // Should already be pushed into a skipped list
            } else {
                let newRecordFlag = false
                let changed = false
                // Do we need to insert?
                if (!dbTaxon) {
                    // Need to insert, create a new one
                    dbTaxon = this.taxonRepo.create(taxonData)
                    newRecordFlag = true
                } else {
                    for (const [k, v] of Object.entries(taxonData)) {
                        if (k in dbTaxon) {
                            // this.logger.log(" k and stuff " + v + " other " + dbTaxon[k])
                            if (dbTaxon[k] != v) {
                                dbTaxon[k] = v
                                changed = true
                            }
                        }
                    }
                }
                // Update with taxonData information
                taxonUpdates.push(dbTaxon)
                taxonRowToBatchRow.set(taxonRowNumber++, batchRowNumber)
                // Only add to the change queue if actually changed
                if (changed || newRecordFlag) {
                    changedTaxons.push(dbTaxon)
                }
            }

        }
         */

        // Process the taxon info first
        /*
        for (const row of batch) {
            batchRowNumber += 1
            const taxonData = {}

            // Flag to keep track if we skip this row
            let skip = false

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
                        const value = csvValue + this.separator + kingdomName
                        // Map rank name to rank ID
                        if (rankAndKingdomToIDMap.has(value)) {
                            // Found the name use the ID
                            csvValue = rankAndKingdomToIDMap.get(value)
                        } else {
                            skip = true
                            if (skippedTaxonsDueToMismatchRank.length < TaxonomyUploadProcessor.MAX_SKIPPED_BUFFER_SIZE) {
                                skippedTaxonsDueToMismatchRank.push(row)
                            }
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
                if (skippedTaxonsDueToMissingName.length < TaxonomyUploadProcessor.MAX_SKIPPED_BUFFER_SIZE) {
                    skippedTaxonsDueToMissingName.push(row)
                }
                this.logger.warn(`Taxon is missing a scientific name! Skipping...`)
                skip = true
                continue
            }
            // Taxon needs a rank id
            if (!taxonData["rankID"]) {
                if (skippedTaxonsDueToMismatchRank.length < TaxonomyUploadProcessor.MAX_SKIPPED_BUFFER_SIZE) {
                    skippedTaxonsDueToMismatchRank.push(row)
                }
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
                    where: { scientificName: taxonData["scientificName"] }
                })

                // See how many things we got back
                if (testTaxons.length == 0) {
                    // A new scientific name, we'll insert
                } else if (testTaxons.length == 1) {
                    // An existing unique name, we'll update
                    dbTaxon = testTaxons[0]
                } else {

                    // Expand the match to include kingdom name and author if present
                    const whereClause = { scientificName: taxonData["scientificName"] }

                    // Does it have a kingdom name?
                    if (taxonData["kingdomName"]) {
                        whereClause["kingdomName"] = taxonData["kingdomName"]
                    }
                    // Does it have an author?
                    if (taxonData["author"]) {
                        whereClause["author"] = taxonData["author"]
                    }
                    // Does it have a rankID?
                    if (taxonData["rankID"]) {
                        whereClause["rankID"] = taxonData["rankID"]
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
                        dbTaxon = moreTestTaxons[0]
                    } else {
                        // Still ambiguous
                        if (skippedTaxonsDueToMultipleMatch.length < TaxonomyUploadProcessor.MAX_SKIPPED_BUFFER_SIZE) {
                            skippedTaxonsDueToMultipleMatch.push(row)
                        }
                        this.logger.warn("Skipping row due to multiple mismatch")
                        skip = true
                    }
                }
            }

            if (skip) {
                // Should already be pushed into a skipped list
            } else {
                let newRecordFlag = false
                let changed = false
                // Do we need to insert?
                if (!dbTaxon) {
                    // Need to insert, create a new one
                    dbTaxon = this.taxonRepo.create(taxonData)
                    newRecordFlag = true
                } else {
                    for (const [k, v] of Object.entries(taxonData)) {
                        if (k in dbTaxon) {
                            // this.logger.log(" k and stuff " + v + " other " + dbTaxon[k])
                            if (dbTaxon[k] != v) {
                                dbTaxon[k] = v
                                changed = true
                            }
                        }
                    }
                }
                // Update with taxonData information
                taxonUpdates.push(dbTaxon)
                taxonRowToBatchRow.set(taxonRowNumber++, batchRowNumber)
                // Only add to the change queue if actually changed
                if (changed || newRecordFlag) {
                    changedTaxons.push(dbTaxon)
                }
            }

        }
         */

        // Save all of the taxons
        //await this.taxonRepo.save(taxonUpdates)
        await this.taxonRepo.upsert(changedTaxons, [])
        this.processed += taxonUpdates.length

        // Now do the taxonomic status, iterating through the taxonUpdates
        // First grab refind all the taxons (need ids in case they were inserted)
        /*
        const reFoundTaxons = await this.taxonRepo.find({
            where: { scientificName: In(scinames) }
        })

        // Map the found taxons to list of taxons organized by scientific name
        const reFoundMap = new Map<string,any[]>()
        for (const taxon of reFoundTaxons) {
            const name = taxon["scientificName"]
            if (!reFoundMap.has(name)) {
                reFoundMap.set(name,[])
            }
            const a = reFoundMap.get(name)
            a.push(taxon)
        }
         */

        const statusRankMap = new Map()
        for (let taxonRowNumber = 0; taxonRowNumber < taxonUpdates.length; taxonRowNumber++) {
            const taxonData = taxonUpdates[taxonRowNumber]
            const statusData = {}
            const row = goodRows[taxonRowToGoodRow.get(taxonRowNumber)]
            let dbStatus = null

            // Flag to keep track if we skip this row
            let skip = false

            let taxons = []

            // Does it have an id
            if (taxonData.id) {
                taxons = [taxonData] /* await this.taxonRepo.find({
                    where: { id: taxonData.id }
                }) */
            } else {
                // Skip this taxon
                taxons = []
            }
            /*
            else {
                // First, let's load the taxon record to get the taxon id
                const whereClause = { scientificName: taxonData["scientificName"] }

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
             */

            // Did we find a taxon?
            if (taxons.length != 1) {
                // Found zero or several
                if (skippedStatusesDueToTaxonMismatch.length < TaxonomyUploadProcessor.MAX_SKIPPED_BUFFER_SIZE) {
                    skippedStatusesDueToTaxonMismatch.push(row)
                }
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

                        // Find the parent or accepted taxon

                        // Map taxon name to taxon ID
                        const whereClause = { scientificName: csvValue }

                        // Does it have a kingdom name?  Use it if it does
                        if (taxonData["kingdomName"]) {
                            whereClause["kingdomName"] = taxonData["kingdomName"]
                        }

                        let taxons = await this.taxonRepo.find({
                            where: whereClause
                        })

                        if (taxons.length == 0) {
                            // Not found, try again without the kingdom name
                            taxons = await this.taxonRepo.find({
                                where: { scientificName: csvValue /*, kingdomName: IsNull()*/ }
                            })
                        }
                        if (taxons.length == 0) {
                            // nothing found skip
                            skip = true
                            if (dbField == "ParentTaxonName") {
                                if (skippedStatusesDueToParentMismatch.length < TaxonomyUploadProcessor.MAX_SKIPPED_BUFFER_SIZE) {
                                    skippedStatusesDueToParentMismatch.push(row)
                                }
                                this.logger.warn(`Parent taxon name ${csvValue} does not have a matching taxon! Skipping...`)
                            } else {
                                if (skippedStatusesDueToAcceptedMismatch.length < TaxonomyUploadProcessor.MAX_SKIPPED_BUFFER_SIZE) {
                                    skippedStatusesDueToAcceptedMismatch.push(row)
                                }
                                this.logger.warn(`Accepted taxon name does not have a matching taxon! Skipping...`)
                            }
                            continue
                        } else if (taxons.length == 1) {
                            // Found one match
                            csvValue = taxons[0].id
                        } else {
                            // Found more than one match
                            // try again with limited to accepted names only
                            const qb = this.taxonRepo.createQueryBuilder('o')
                                .innerJoin('o.taxonStatuses', 'c')
                                .where('c.taxonAuthorityID = :authorityID', { authorityID: job.data.authorityID })
                                .andWhere('o.scientificName = :sciname', {sciname: csvValue})
                                .andWhere('c.taxonID = c.taxonIDAccepted')

                            // Does it have a kingdom name?  Use it if it does
                            if (taxonData["kingdomName"]) {
                                qb.andWhere('o.kingdomName = :kingdom', {kingdom: taxonData["kingdomName"]})
                            }

                            taxons = await qb.getMany()

                            if (taxons.length == 1) {
                                // found exactly one, good!
                                csvValue = taxons[0].id
                            } else {
                                // Still have problems skip
                                skip = true
                                if (dbField == "ParentTaxonName") {
                                    if (skippedStatusesDueToParentMismatch.length < TaxonomyUploadProcessor.MAX_SKIPPED_BUFFER_SIZE) {
                                        skippedStatusesDueToParentMismatch.push(row)
                                    }
                                    this.logger.warn(`Parent taxon name has more than one matching taxon! Skipping...`)
                                } else {
                                    if (skippedStatusesDueToAcceptedMismatch.length < TaxonomyUploadProcessor.MAX_SKIPPED_BUFFER_SIZE) {
                                        skippedStatusesDueToAcceptedMismatch.push(row)
                                    }
                                    this.logger.warn(`Accepted taxon has more than one matching taxon! Skipping...`)
                                }
                                continue
                            }
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

            // Look for the statuses for this taxon
            let statuses = []

            // this.logger.log("zzzz looking for status " + taxon.id)
            statuses = await this.statusRepo.find({
                where: {
                    taxonID: taxon.id,
                    taxonAuthorityID: job.data.authorityID
                }
            })

            // this.logger.log("zzzz # of status " + statuses.length)
            if (statuses.length == 0) {
                // No status yet, add it
            } else if (statuses.length == 1) {
                // Update the found status
                dbStatus = statuses[0]
            } else {
                // Found more than one status
                skip = true
                if (skippedStatusesDueToMultipleMatch.length < TaxonomyUploadProcessor.MAX_SKIPPED_BUFFER_SIZE) {
                    skippedStatusesDueToMultipleMatch.push(row)
                }
                this.logger.warn(`Taxon is in conflict, has multiple statuses, need to resolve! Skipping...`)
                continue
            }

            // Update
            if (skip) {
                // Skipped, it is already in one of the skipped queues
            } else {
                let newRecordFlag = false
                if (!dbStatus) {
                    // Create
                    dbStatus = this.statusRepo.create(statusData)
                    newRecordFlag = true
                } else {
                    // Since the save later will die on already present status, need to delete this one if found
                   /* Curt took out since now using upsert
                    this.statusRepo.delete({
                        taxonID: taxon.id,
                        taxonAuthorityID: job.data.authorityID
                    })

                    */
                }

                // Set the taxon id explicitly
                dbStatus.taxonID = taxon.id

                // Set the taxonomic authority explicitly
                dbStatus.taxonAuthorityID = job.data.authorityID

                let changed = false
                for (const [k, v] of Object.entries(statusData)) {
                    if (k in dbStatus) {
                        if (dbStatus[k] != v) {
                            dbStatus[k] = v
                            changed = true
                        }
                    }
                }

                if (changed || newRecordFlag) {
                    changedStatuses.push(dbStatus)
                }
                statusUpdates.push(dbStatus)
                // Figure out the rank for this status update
                if (!statusRankMap.has(taxon.rankID)) {
                    statusRankMap.set(taxon.rankID, [])
                }
                const rankList = statusRankMap.get(taxon.rankID)
                rankList.push(dbStatus)
                //statusRankMap.set(taxon.rankID, rankList)
            }
        }

        // Save all of the statuses
        await this.statusRepo.upsert(changedStatuses, [])
        //await this.statusRepo.upsert(statusUpdates, ["taxonID", "taxonIDAccepted", "taxonAuthorityID"])
        this.processed += statusUpdates.length

        // Now move the taxons in order by rank from top to bottom
        let keys = [...statusRankMap.keys()]
        // this.logger.log("zzzz size of keys is " + keys.length)
        const toDo = []
        keys.sort((a, b) => {
            return a - b
        }).forEach((key) => {
            // this.logger.log("zzzz key is " + key)
            statusRankMap.get(key).forEach((status) => {
                toDo.push(status)
            })
        })

        for (let status of toDo) {
            this.moveTaxon(status.taxonID,status.taxonAuthorityID,status.parentTaxonID)
        }

        let logMsg = `Processing uploads for taxa authority ID ${job.data.authorityID} `
        logMsg += `(${new Intl.NumberFormat().format(taxonUpdates.length)} taxons processed and `
        logMsg += `${new Intl.NumberFormat().format(statusUpdates.length)} statuses processed)...`
        this.logger.log(logMsg)
    }

    private async moveTaxon(taxonID, taxonAuthorityID, parentTaxonID) {
        // await this.taxaEnumTreeService.moveTaxon(taxonID,taxonAuthorityID,parentTaxonID)
        await this.taxaEnumTreeService.extendTaxonTree(taxonID,taxonAuthorityID,parentTaxonID)
    }

    private async onCSVComplete(uid: number, authorityID: number) {
        await this.notifications.save({
            uid,
            message: `Your upload to taxa authority ID ${authorityID} has completed`
        })
    }
}
