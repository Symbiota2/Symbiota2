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
        const synonymFileMap = new Map()
        for await (const batch of csvIteratorWithTrimValues<DeepPartial<Taxon>>(upload.filePath)) {
            try {
                await this.splitBatchByRank(kingdomAndRankToIDMap, fileMap, synonymFileMap, job, upload, batch);
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

        // Now close all the synonym streams
        const synonymKeys =[ ...synonymFileMap.keys() ].sort((a,b) => a-b)
        synonymKeys.forEach((key) => {
            synonymFileMap.get(key).end()
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
                error = await this.processRankFile(key, job, upload, false)
                // this.logger.log("TEST rank file processed " + error)
            }
            for (let key of synonymKeys) {
                // this.logger.log("TEST doing synonym " + key)
                error = await this.processRankFile(key, job, upload, true)
                // this.logger.log("TEST rank synonym file processed " + error)
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

    private async processRankFile(key, job, upload, isSynonym) {
        // this.logger.log(" TEST doing processRankFile " + this.taxonFilesPath + key)
        try {
            let fileName = this.taxonFilesPath + key
            if (isSynonym) {
                fileName = this.taxonFilesPath + "synonym" + key
            }
            for await (const batch of objectIterator<DeepPartial<Taxon>>(fileName)) {
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
    private async splitBatchByRank(rankMap: Map<string, number>, fileMap : Map<number, any>,  synonymFileMap : Map<number, any>, job, upload: TaxonomyUpload, batch: DeepPartial<Taxon>[]) {
        // We first need the kingdomName and the rankName fields
        let kingdomInRowName = null
        let rankInRowName = null
        let scinameInRowName = null
        let acceptedInRowName = null
        for (const [csvField, dbField] of Object.entries(upload.fieldMap)) {
            if (dbField == "kingdomName") {
                kingdomInRowName = csvField
            }
            if (dbField == "RankName") {
                rankInRowName = csvField
            }
            if (dbField == "scientificName") {
                scinameInRowName = csvField
            }
            if (dbField == "AcceptedTaxonName") {
                acceptedInRowName = csvField
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

        // Must have a scientificName field
        if (!scinameInRowName) {
            this.logger.error(`Mapping is missing a field for scientific name! Exiting...`)
            throw new Error('Missing scientific name field')
        }

        // Must have a AcceptedTaxonName field
        if (!acceptedInRowName) {
            this.logger.error(`Mapping is missing a field for accepted taxon name! Exiting...`)
            throw new Error('Missing accepted taxon name field')
        }

        // Process each row in batch
        for (const row of batch) {
            const rankValue = row[rankInRowName]
            const kingdomValue = row[kingdomInRowName]
            const scinameValue = row[scinameInRowName]
            const acceptedValue = row[acceptedInRowName]
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
                if (scinameValue == acceptedValue) {
                    // It is not a synonym
                    if (!fileMap.has(file)) {
                        let writeStream = fs.createWriteStream(this.taxonFilesPath + file)
                        fileMap.set(file,writeStream)
                    }
                    const writeStream = fileMap.get(file)
                    // console.log("writing accepted row " + scinameValue + " " + rankValue)
                    writeStream.write(JSON.stringify(row) + "\n")
                } else {
                    // It is a synonym
                    if (!synonymFileMap.has(file)) {
                        let writeStream = fs.createWriteStream(this.taxonFilesPath + "synonym" + file)
                        synonymFileMap.set(file,writeStream)
                    }
                    const writeStream = synonymFileMap.get(file)
                    // console.log("writing synonym row " + scinameValue + " " + rankValue)
                    writeStream.write(JSON.stringify(row) + "\n")
                }
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
        const newTaxons: Taxon[] = []
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
        const artificialColumns = ["AcceptedTaxonName", "ParentTaxonName", "RankName", "family"]

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
            // Need to set any field as artificial
            // if (!fieldToTable.has(field)) {
                fieldToTable.set(field, "artificial")
            //}
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
            // relations: ["taxonstatuses", "taxonstatuses.parentTaxon", "taxonstatuses.acceptedTaxon"],
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

        const taxonIds = []
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
                    this.logger.warn("Skipping row for " + name + " due to multiple mismatch")
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
                    // console.log(" new taxon, create ")
                    // Need to insert, create a new one
                    dbTaxon = this.taxonRepo.create(taxonData)
                    newRecordFlag = true
                } else {
                    // console.log(" existing taxon, do not create ")
                    for (const [k, v] of Object.entries(taxonData)) {
                        if (k in dbTaxon) {
                            if (!artificialColumns.includes(k)) {
                                // this.logger.log(" k and stuff " + v + " other " + dbTaxon[k])
                                if (dbTaxon[k] != v) {
                                    dbTaxon[k] = v
                                    changed = true
                                }
                            }
                        }
                    }
                }
                // Update with taxonData information
                taxonUpdates.push(dbTaxon)

                taxonRowToGoodRow.set(taxonRowNumber++, goodRowNumber)
                // Only add to the change queue if actually changed
                if (changed) {
                    taxonIds.push(dbTaxon.id)
                    changedTaxons.push(dbTaxon)
                } else if (newRecordFlag) {
                    changedTaxons.push(dbTaxon)
                }
            }

        }

        // Save the new taxons
        //const resultTaxons = await this.taxonRepo.save(newTaxons)
        //await this.taxonRepo.upsert(changedTaxons, [])
        //this.processed += newTaxons.length

        // Go through the results adding the taxonsIDs to the new taxons

        // Save the changed taxons
        //await this.taxonRepo.save(taxonUpdates)
        await this.taxonRepo.upsert(changedTaxons, [])
        this.processed += taxonUpdates.length

        // Grab the taxon statuses for those that changed, new ones won't have an id
        let foundStatuses = []
        if (taxonIds.length > 0) {
            foundStatuses = await this.statusRepo.find({
                relations: ["parentTaxon", "acceptedTaxon"],
                where: {
                    taxonID: In(taxonIds),
                    taxonAuthorityID: job.data.authorityID
                }
            })
        }

        const taxonIDtoStatusesMap = new Map<any,any[]>()
        for (let status of foundStatuses) {
            if (!taxonIDtoStatusesMap.has(status.taxonID)) {
                taxonIDtoStatusesMap.set(status.taxonID,[])
            }
            const statuses = taxonIDtoStatusesMap.get(status.taxonID)
            statuses.push(status)
        }

        // Populate status data
        const needsAcceptedNameMap = new Map<any,any[]>()
        const needsParentNameMap = new Map<any,any[]>()
        const updateAcceptedNameMap = new Map<any,any[]>()
        const updateParentNameMap = new Map<any,any[]>()
        const parentNamesNeeded = []
        const acceptedNamesNeeded = []
        const statusesToDelete = []
        const statusesToAdd : DeepPartial<TaxonomicStatus>[] = []
        const statusesToUpdateLater = []
        for (let taxonRowNumber = 0; taxonRowNumber < taxonUpdates.length; taxonRowNumber++) {
            const taxonData = taxonUpdates[taxonRowNumber]
            const statusData = {}
            const row = goodRows[taxonRowToGoodRow.get(taxonRowNumber)]
            let dbStatus = null
            let skip = false
            let skipAdding = false

            let statuses = []
            if (taxonIDtoStatusesMap.has(taxonData.id)) {
                statuses = taxonIDtoStatusesMap.get(taxonData.id)
            }

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
                    // "AcceptedTaxonName", "ParentTaxonName", "family"

                    if (dbField == "ParentTaxonName") {
                        if (dbStatus == null) {
                            // Have to create the status
                            // Add parent name to list of names to lookup
                            skip = true
                            const name = row["ParentTaxonName"]
                            if (!needsParentNameMap.has(name)) {
                                needsParentNameMap.set(name, [])
                            }
                            const a = needsParentNameMap.get(name)
                            statusData["myTaxonID"] = taxonData.id
                            a.push(statusData)
                            if (!skipAdding) {
                                statusesToAdd.push(statusData)
                            }
                            skipAdding = true
                            parentNamesNeeded.push(row["ParentTaxonName"])
                        } else {
                            if (dbStatus.parentTaxon.scientificName == row["ParentTaxonName"]) {
                                // Name is the same no update needed
                                statusData["parentTaxonID"] = dbStatus.parentTaxon.id
                            } else {
                                // Name is different, update
                                // Add parent name to list of names to lookup
                                skip = true
                                const name = row["ParentTaxonName"]
                                if (!updateParentNameMap.has(name)) {
                                    updateParentNameMap.set(name, [])
                                }
                                const a = updateParentNameMap.get(name)
                                if (!skipAdding) {
                                    // Set the taxon id explicitly
                                    dbStatus.taxonID = taxonData.id

                                    // Set the taxonomic authority explicitly
                                    dbStatus.taxonAuthorityID = job.data.authorityID
                                    statusesToUpdateLater.push(dbStatus)
                                }
                                skipAdding = true
                                a.push(dbStatus)
                                parentNamesNeeded.push(row["ParentTaxonName"])
                            }
                        }
                    } else if (dbField == "AcceptedTaxonName") {
                        if (dbStatus == null) {
                            // Have to create the status
                            if (csvValue == taxonData.scientificName) {
                                // This one is accepted
                                statusData["taxonIDAccepted"] = taxonData.id
                            } else {
                                // Add accepted name to list of names to lookup
                                skip = true
                                const name = row["AcceptedTaxonName"]
                                if (!needsAcceptedNameMap.has(name)) {
                                    needsAcceptedNameMap.set(name, [])
                                }
                                const a = needsAcceptedNameMap.get(name)
                                // Set the taxon id explicitly
                                statusData["myTaxonID"] = taxonData.id
                                a.push(statusData)
                                if (!skipAdding) {
                                    statusesToAdd.push(statusData)
                                }
                                skipAdding = true
                                acceptedNamesNeeded.push(row["AcceptedTaxonName"])
                            }
                        } else {
                            if (dbStatus.acceptedTaxon.scientificName == row["AcceptedTaxonName"]) {
                                // Name is the same no update needed
                                statusData["taxonIDAccepted"] = dbStatus.acceptedTaxon.id
                            } else {
                                // Name is different, update
                                // Add accepted name to list of names to lookup
                                skip = true
                                const name = row["AcceptedTaxonName"]
                                if (!updateAcceptedNameMap.has(name)) {
                                    updateAcceptedNameMap.set(name, [])
                                }
                                const a = updateAcceptedNameMap.get(name)
                                a.push(dbStatus)
                                if (!skipAdding) {
                                    // Set the taxon id explicitly
                                    dbStatus.taxonID = taxonData.id

                                    // Set the taxonomic authority explicitly
                                    dbStatus.taxonAuthorityID = job.data.authorityID
                                    statusesToUpdateLater.push(dbStatus)
                                }
                                skipAdding = true
                                acceptedNamesNeeded.push(row["AcceptedTaxonName"])
                            }
                        }
                    } else if (dbField == "family") {
                        statusData["family"] = csvValue === '' ? null : csvValue
                    }
                }

                if (!(fieldToTable.get(dbField) == "status")) {
                    continue
                }

                // Copy this field it is part of the status data
                statusData[dbField] = csvValue === '' ? null : csvValue
            }

            // Update
            if (skip) {
                // Skipped, it is already in one of the skipped queues
            } else {
                let newRecordFlag = false
                if (!dbStatus) {
                    // Create
                    dbStatus = await this.statusRepo.create(statusData)
                    newRecordFlag = true
                } else {
                    statusesToDelete.push(taxonData.id)
                }

                // Set the taxon id explicitly
                dbStatus.taxonID = taxonData.id

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
            }
        }

        // Grab parent info for accepted parent names
        let parentInfo = []
        if (parentNamesNeeded.length > 0) {
            const parentqb = this.taxonRepo.createQueryBuilder('o')
                .innerJoin('o.taxonStatuses', 'c')
                .where('c.taxonAuthorityID = :authorityID', { authorityID: job.data.authorityID })
                .andWhere('o.scientificName IN (:parents)', {parents: parentNamesNeeded})
                .andWhere('c.taxonID = c.taxonIDAccepted')

            parentInfo = await parentqb.getMany()
        }

        // Process the missing parents
        for (let info of parentInfo) {
            if (needsParentNameMap.has(info.scientificName)) {
                const a = needsParentNameMap.get(info.scientificName)
                a.forEach((statusData) => {
                    statusData["parentTaxonID"] = info.id
                })
                // Remove from map
                needsParentNameMap.delete(info.scientificName)
            }
            if (updateParentNameMap.has(info.scientificName)) {
                const a = updateParentNameMap.get(info.scientificName)
                a.forEach((dbStatus) => {
                    dbStatus.parentTaxonID = info.id
                })
                // Remove from map
                updateParentNameMap.delete(info.scientificName)
            }
        }

        // If there are any keys left in the map we didn't find a parent
        for (let key of needsParentNameMap.keys()) {
            if (skippedStatusesDueToParentMismatch.length < TaxonomyUploadProcessor.MAX_SKIPPED_BUFFER_SIZE) {
                const a = needsParentNameMap.get(key)
                for (let rec of a) {
                    skippedStatusesDueToParentMismatch.push(rec)
                    // Remove from list of statuses to insert
                    rec["skipMe"] = true
                }
            }
            this.logger.warn(`Parent taxon name ${key} to insert does not have a matching taxon! Skipping...`)
        }

        // If there are any keys left in the map we didn't find a parent
        for (let key of updateParentNameMap.keys()) {
            if (skippedStatusesDueToParentMismatch.length < TaxonomyUploadProcessor.MAX_SKIPPED_BUFFER_SIZE) {
                const a = updateParentNameMap.get(key)
                for (let rec of a) {
                    skippedStatusesDueToParentMismatch.push(rec)
                    // Remove from list of statuses to insert
                    rec["skipMe"] = true
                }
            }
            this.logger.warn(`Parent taxon name ${key} to update does not have a matching taxon! Skipping...`)
        }

        let acceptedInfo = []
        if (acceptedNamesNeeded.length > 0) {
            // Grab the accepted info for accepted names
            const acceptedqb = this.taxonRepo.createQueryBuilder('o')
                .innerJoin('o.taxonStatuses', 'c')
                .where('c.taxonAuthorityID = :authorityID', { authorityID: job.data.authorityID })
                .andWhere('o.scientificName IN (:accepteds)', {accepteds: acceptedNamesNeeded})
                .andWhere('c.taxonID = c.taxonIDAccepted')

            acceptedInfo = await acceptedqb.getMany()
        }

        // Process the missing accepted
        for (let info of acceptedInfo) {
            if (needsAcceptedNameMap.has(info.scientificName)) {
                const a = needsAcceptedNameMap.get(info.scientificName)
                a.forEach((statusData) => {
                    statusData["taxonIDAccepted"] = info.id
                })
                // Remove from map
                needsAcceptedNameMap.delete(info.scientificName)
            }
            if (updateAcceptedNameMap.has(info.scientificName)) {
                const a = updateAcceptedNameMap.get(info.scientificName)
                a.forEach((dbStatus) => {
                    dbStatus.acceptedTaxonID = info.id
                })
                // Remove from map
                updateAcceptedNameMap.delete(info.scientificName)
            }
        }

        // If there are any keys left in the map we didn't find an accepted name
        for (let key of needsAcceptedNameMap.keys()) {
            if (skippedStatusesDueToAcceptedMismatch.length < TaxonomyUploadProcessor.MAX_SKIPPED_BUFFER_SIZE) {
                for (let obj of needsAcceptedNameMap.get(key)) {
                    skippedStatusesDueToAcceptedMismatch.push(obj)
                    // Remove from list of statuses to insert
                    obj["skipMe"] = true
                }
            }
            this.logger.warn(`Accepted taxon name to insert does not have a matching taxon! Skipping...`)
        }

        // If there are any keys left in the map we didn't find an accepted name
        for (let key of updateAcceptedNameMap.keys()) {
            if (skippedStatusesDueToAcceptedMismatch.length < TaxonomyUploadProcessor.MAX_SKIPPED_BUFFER_SIZE) {
                for (let obj of updateAcceptedNameMap.get(key)) {
                    skippedStatusesDueToAcceptedMismatch.push(obj)
                    // Remove from list of statuses to update
                    obj["skipMe"] = true
                }
            }
            this.logger.warn(`Accepted taxon name to update does not have a matching taxon! Skipping...`)
        }

        // Go through the statusToUpdateLater
        for (let status of statusesToUpdateLater) {
            // These are already DB statuses
            if (!status.hasOwnProperty("skipMe")) {
                statusesToDelete.push(status.taxonID)
                changedStatuses.push(status)
                statusUpdates.push(status)
            }
        }

        // Go through the statuses to add
        for (let statusData of statusesToAdd) {
            if (!statusData["skipMe"]) {
                // Convert status to a dbstatus
                const status = await this.statusRepo.create(statusData)

                // Set the taxon id explicitly
                status.taxonID = +statusData["myTaxonID"]

                // Set the taxonomic authority explicitly
                status.taxonAuthorityID = job.data.authorityID

                changedStatuses.push(status)
                statusUpdates.push(status)
            }
        }

        // Just to be extra cautious delete the existing statuses for ids to delete
        if (statusesToDelete.length > 0) {
            await this.statusRepo.createQueryBuilder()
                .delete()
                .where("taxonID IN (:ids)", {ids: statusesToDelete})
                .execute()
        }

        // Save all of the statuses
        await this.statusRepo.upsert(changedStatuses, [])
        this.processed += statusUpdates.length

        const taxonPairs = []
        for (let status of changedStatuses) {
            taxonPairs.push([status.taxonID,status.parentTaxonID])
            //this.moveTaxon(status.taxonID,status.taxonAuthorityID,status.parentTaxonID)
        }
        this.moveTaxons(taxonPairs,job.data.authorityID)

        let logMsg = `Processing uploads for taxa authority ID ${job.data.authorityID} `
        logMsg += `(${new Intl.NumberFormat().format(taxonUpdates.length)} taxons processed and `
        logMsg += `${new Intl.NumberFormat().format(statusUpdates.length)} statuses processed)...`
        this.logger.log(logMsg)
    }

    private async moveTaxon(taxonID, taxonAuthorityID, parentTaxonID) {
        // await this.taxaEnumTreeService.moveTaxon(taxonID,taxonAuthorityID,parentTaxonID)
        await this.taxaEnumTreeService.extendTaxonTree(taxonID,taxonAuthorityID,parentTaxonID)
    }

    private async moveTaxons(taxonPairs, taxonAuthorityID) {
        // await this.taxaEnumTreeService.moveTaxon(taxonID,taxonAuthorityID,parentTaxonID)
        await this.taxaEnumTreeService.extendTaxonTreeWithList(taxonPairs, taxonAuthorityID)
    }

    private async onCSVComplete(uid: number, authorityID: number) {
        await this.notifications.save({
            uid,
            message: `Your upload to taxa authority ID ${authorityID} has completed`
        })
    }
}
