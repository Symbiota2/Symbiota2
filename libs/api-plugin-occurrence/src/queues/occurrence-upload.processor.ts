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
    CollectionStat,
    Occurrence,
    OccurrenceUpload, TaxaEnumTreeEntry, Taxon, TaxonomicAuthority, TaxonomicStatus, TaxonomicUnit,
    UserNotification
} from '@symbiota2/api-database';
import { DeepPartial, Repository } from 'typeorm';
import { QUEUE_ID_OCCURRENCE_UPLOAD } from './occurrence-upload.queue';
import { csvIterator, csvIteratorCustomSeperator, csvIteratorTabs, getCsvSeperator } from '@symbiota2/api-common';
import {
    CollectionStatsUpdateJob,
    QUEUE_ID_COLLECTION_STATS_UPDATE
} from '@symbiota2/api-plugin-collection';
import { TaxonFindByMatchingParams } from '../../../api-plugin-taxonomy/src/taxon/dto/taxon-find-parms';
import { ApiProperty } from '@nestjs/swagger';
import { TaxonInputDto } from '../../../api-plugin-taxonomy/src/taxon/dto/TaxonInputDto';
import { TaxonomicStatusInputDto } from '../../../api-plugin-taxonomy/src/taxonomicStatus/dto/TaxonomicStatusInputDto';
import { type } from 'node:os';

export interface OccurrenceUploadJob {
    uid: number;
    collectionID: number;
    uploadID: number;
}

@Processor(QUEUE_ID_OCCURRENCE_UPLOAD)
export class OccurrenceUploadProcessor {
    private processed = 0;
    private readonly logger = new Logger(OccurrenceUploadProcessor.name);
    private taxonomicAuthorityID

    constructor(
        @Inject(OccurrenceUpload.PROVIDER_ID)
        private readonly uploads: Repository<OccurrenceUpload>,
        @Inject(UserNotification.PROVIDER_ID)
        private readonly notifications: Repository<UserNotification>,
        @Inject(Occurrence.PROVIDER_ID)
        private readonly occurrences: Repository<Occurrence>,
        @Inject(CollectionStat.PROVIDER_ID)
        private readonly collectionStats: Repository<CollectionStat>,
        @Inject(Taxon.PROVIDER_ID)
        private readonly taxa: Repository<Taxon>,
        @Inject(TaxonomicStatus.PROVIDER_ID)
        private readonly taxonStatus: Repository<Taxon>,
        @Inject(TaxonomicUnit.PROVIDER_ID)
        private readonly taxonRanks: Repository<TaxonomicUnit>,
        @Inject(TaxaEnumTreeEntry.PROVIDER_ID)
        private readonly taxaEnumTree: Repository<TaxaEnumTreeEntry>,
        @InjectQueue(QUEUE_ID_COLLECTION_STATS_UPDATE)
        private readonly collectionStatsUpdateQueue: Queue<CollectionStatsUpdateJob>) {
        // const authority= new TaxonomicAuthority()
        // this.taxonomicAuthorityID = authority.getDefaultAuthorityID()
    }

    // TODO: Wrap in a transaction? Right now each chunk goes straight to the database until a failure occurs
    /**
     * Retrieve an upload job from the database & convert it into occurrences in the database
     */
    @Process()
    async upload(job: Job<OccurrenceUploadJob>): Promise<void> {
        const authority = new TaxonomicAuthority()
        this.taxonomicAuthorityID = await authority.getDefaultAuthorityID()
        // Count the number of processed occurrences
        this.processed = 0;

        // Find the Upload specified in the OccurrenceUploadJob
        const upload = await this.uploads.findOne(job.data.uploadID);
        if (!upload) {
            return;
        }
        this.logger.log(`Upload of '${upload.filePath}' started...`);

        // Parse the csv in batches
        let error: Error = null;
        let seperator: string = await getCsvSeperator(upload.filePath);
        for await (const batch of csvIteratorCustomSeperator<DeepPartial<Occurrence>>(upload.filePath, seperator)) {
            try {
                await this.onCSVBatch(job, upload, batch);
            } catch (e) {
                error = e;
                break;
            }
        }

        if (error) {
            console.log("\n================\nJOB FAILED Err Name: " + error.name + + "Err message: " + error.message + "\n=======================\n");
            // if (!error.message.startsWith("WARN_DATA_TRUNCATED"))
            return;
            //     await job.moveToFailed(error)
        }
        else {
            try {
                await this.onCSVComplete(job.data.uid, job.data.collectionID);
            } catch (e) {
                await job.moveToFailed(e);
            }
        }
    }

    @OnQueueCompleted()
    async queueCompletedHandler(job: Job) {
        this.logger.log(`Upload complete for collection ID ${job.data.collectionID}`);
    }

    @OnQueueFailed()
    async queueFailedHandler(job: Job, err: Error) {
        this.logger.error(JSON.stringify(err));
        try {
            return this.onCSVComplete(job.data.uid, job.data.collectionID);
        } catch (e) {
            this.logger.error(`Error updating statistics: ${JSON.stringify(e)}`);
        }
        await this.notifications.save({ uid: job.data.uid, message: `Upload failed: ${JSON.stringify(err)}` });
    }

    /**
     * Process a batch of occurrences from a csv
     */
    private async onCSVBatch(job: Job<OccurrenceUploadJob>, upload: OccurrenceUpload, batch: DeepPartial<Occurrence>[]) {
        // All updates that will be made to Occurrence entities
        const allOccurrenceUpdates = [];

        // For each csv row
        let rowCount = 0;
        for (const occurrenceRow of batch) {
            try {
                const occurrenceData = {};
                // Find the csv field and cooresponding csv field defined by the user in the Upload's
                // fieldMap. See patchUploadFieldMap() in libs/api-plugin-occurrence/src/occurrence/occurrence.service.ts
                console.log(rowCount);
                for (const [csvField, dbField] of Object.entries(upload.fieldMap)) {
                    // If the csvField wasn't mapped to a dbField, skip it
                    if (!dbField) {
                        continue;
                    }
                    // Grab the value of the csvField from the csv
                    const csvValue = occurrenceRow[csvField];
                    // console.log("MIN ELEVATION: " + occurrenceRow["minimumElevationInMeters"]);
                    // console.log("MIN ELEVATION TYPE: " + typeof (occurrenceRow["minimumElevationInMeters"]));
                    //  console.log("CSV Field: " + csvField + " CSV VALUE: " + csvValue + "VALUE TYPE: " + typeof (csvValue));

                    // If the value's truthy, store it in the Occurrence entity. If not, store
                    // null in the Occurrence entity
                    if (csvField == "coordinateUncertaintyInMeters") {
                        //console.log("Scientific Name: " + occurrenceRow["scientificName"])
                        //console.log("Coord uncertainty TYPE: " + typeof (occurrenceRow["coordinateUncertaintyInMeters"]));
                        occurrenceData[dbField] = csvValue === '' ? null : Number(csvValue);
                        // console.log("Coord uncertainty type after conversion: " + typeof (occurrenceData[csvField]))
                    }

                    else if (csvField == "minimumElevationInMeters") {
                        //console.log("Scientific Name: " + occurrenceRow["scientificName"])
                        //console.log("Min elevation TYPE: " + typeof (occurrenceRow["minimumElevationInMeters"]));
                        occurrenceData[dbField] = csvValue === '' ? null : Number(csvValue);
                        if (occurrenceData[dbField] != null)
                            console.log("\n==========\nMIN ELEVATION VALUE: " + occurrenceData[dbField] +
                                " Min elevation type after conversion: " + typeof (occurrenceData[csvField]))
                    }

                    // else {
                    occurrenceData[dbField] = csvValue === '' ? null : csvValue;
                    // }
                }

                // Field the database field that cooresponds to the user-defined csv field
                // that uniquely identifies each row in the csv. This could be something like 'id' or
                // 'catalogNumber'.
                const dbIDField = upload.fieldMap[upload.uniqueIDField];
                const currenceOccurrenceUniqueValue = occurrenceData[dbIDField];

                // Without a unique value for the row, skip it
                if (!currenceOccurrenceUniqueValue) {
                    continue;
                }

                // Hard code based on job's collection ID
                occurrenceData['collectionID'] = job.data.collectionID;

                // Find any existing occurrence in the database with an id that matches the value for
                // uniqueIDField. It'll be updated instead of a new one being created.
                const dbOccurrence = await this.occurrences.findOne({
                    [dbIDField]: currenceOccurrenceUniqueValue
                });

                // We need to get rid of this; If it's already in the db, then
                // dbOccurrence has it; If it's not, we'll generate a new one
                delete occurrenceData['id'];

                // NOTE This should also be generated, but currently we don't have the functionality to:
                // a) Create a new Taxon based on the occurrence csv fields and link it to the TaxaEnumTree
                // b) Find an existing Taxon based on the occurrence csv fields and link it to the created/updated
                // occurrence
                // So right now any occurrence csv uploads WILL NOT be properly linked to Taxonomy, and not
                // properly searchable as a result
                // delete occurrenceData['taxonID'];
                const taxonParams = new TaxonFindByMatchingParams()
                //Relax type system to extract kingdom.
                const newRow = <any>occurrenceRow
                if (occurrenceData['scientificName'] != null && occurrenceData['scientificName'].trim() != "") {
                    taxonParams.scientificName = occurrenceData['scientificName']
                    taxonParams.genus = occurrenceData['genus']
                    taxonParams.family = occurrenceData['family']
                    taxonParams.taxonAuthorityID = this.taxonomicAuthorityID
                    //Hack since kingdom is not an occurrence table column.
                    taxonParams.kingdom = newRow['kingdom']
                    occurrenceData['taxonID'] = await this.findOrCreateByMatching(taxonParams)
                }
                rowCount++;

                // Update
                if (dbOccurrence) {
                    // If we found a matching occurrence, use the csv data to update its fields
                    for (const [k, v] of Object.entries(occurrenceData)) {
                        if (k in dbOccurrence) {
                            dbOccurrence[k] = v;
                        }
                    }
                    allOccurrenceUpdates.push(dbOccurrence);
                }
                // Insert
                else {
                    const occurrence = this.occurrences.create(occurrenceData);
                    allOccurrenceUpdates.push(occurrence);
                }
            }
            catch (error) {
                console.log("\n==============================\nERRORRRRRRRRRRRR: current minelevation: " + occurrenceRow["minimumElevationInMeters"] + "\n======================================\n")
                throw error
            }

        }

        // Save all of the edits for this batch
        await this.occurrences.save(allOccurrenceUpdates);
        this.processed += allOccurrenceUpdates.length;

        let logMsg = `Processing uploads for collectionID ${job.data.collectionID} `;
        logMsg += `(${new Intl.NumberFormat().format(this.processed)} processed)...`;
        this.logger.log(logMsg);
    }

    /**
     * Find the taxons that match a given plethora of information about the taxon
     * Set find params using the 'TaxonFindNamesParams'
     * @param params - the 'TaxonFindByMatchingParams'
     * @returns Observable of response from api casted as `number`
     * will be the found taxon
     * @returns `of(null)` if api errors
     * @see Taxon
     * @see TaxonFindByMatchingParams
     */
    private async findOrCreateByMatching(params: TaxonFindByMatchingParams) {
        const { ...qParams } = params
        let taxons = []
        //if (qParams.taxonAuthorityID) {
        // Have to use the query builder since where filter on nested relations does not work
        //    const qb = this.taxa.createQueryBuilder('o')
        //        .innerJoin('o.taxonStatuses', 'c')
        //        .where('c.taxonAuthorityID = :authorityID', { authorityID: params.taxonAuthorityID })
        //        .andWhere('o.scientificName = :sciname', {sciname: params.scientificName})
        //
        //    taxons = await qb.getMany()
        //} else {
        taxons = await this.taxa.find({ where: { scientificName: params.scientificName } })
        //}

        // Check to see how many we found
        if (taxons.length == 1) {
            // Found exactly one, good, let's use it
            return taxons[0].id
        } else if (taxons.length == 0) {
            // Create
            return this.createTaxon(params)
        } else {
            // Found more than one.  Let's process these to narrow to at most one.
            // Fist, use kingdom
            if (params.kingdom) {
                taxons = taxons.filter((taxon) => {
                    return taxon.kingdom == params.kingdom
                })
                if (taxons.length == 1) {
                    // Found exactly one, good, let's use it
                    return taxons[0].id
                } else if (taxons.length == 0) {
                    // Create
                    return this.createTaxon(params)
                }
            }

            // Next try the family
            if (params.family) {
                taxons = taxons.filter((taxon) => {
                    return taxon.family == params.family
                })
                if (taxons.length == 1) {
                    // Found exactly one, good, let's use it
                    return taxons[0].id
                } else if (taxons.length == 0) {
                    // Create
                    return this.createTaxon(params)
                }
            }

            // Always more than one match
            return null

        }
    }

    private async createTaxon(params) {
        const taxon = new TaxonInputDto(
            {
                kingdomName: params.kingdom, // get kingdom
                rankID: 0, // get species rank
                scientificName: params.scientificName, // get scientific name
                author: "",
                phyloSortSequence: 50,
                status: "",
                source: "",
                notes: "",
                hybrid: "",
                securityStatus: 0,
                lastModifiedUID: null,
                lastModifiedTimestamp: new Date(),
                initialTimestamp: new Date()
            }
        )

        const block = await this.taxa.create(taxon)

        const names = params.scientificName.split(' ')


        // Let's look up the genus to get the parent
        let taxons = []
        if (params.genus) {
            taxons = await this.taxa.find({ where: { scientificName: params.genus } })
        } else {
            taxons = await this.taxa.find({ where: { scientificName: names[0] } })
        }
        if (taxons.length == 0 && params.family) {
            taxons = await this.taxa.find({ where: { scientificName: params.family } })
        }
        console.log("TAXON LENGTH: " + taxons.length)
        if (taxons.length == 0) {
            // We don't have a parent, skip the rest
            return
        }

        // Even if we found two or more, just get the first one to be the parent
        // No way to further disambiguate
        const parentTaxon = taxons[0]

        // Save the taxon
        // First check that the kingdom is that of its parent
        console.log("KINGDOM IS: " + block.kingdomName + " PARENT TAXON: " + parentTaxon.kingdomName)
        if (block.kingdomName == null || block.kingdomName == undefined) {
            block.kingdomName = parentTaxon.kingdomName
        } else {
            if (block.kingdomName != parentTaxon.kingdomName) {
                // return, don't add the status, not the parent!
                return
            }
        }
        if (names.length == 1) {
            await block.setRank("Genus")
        } else if (names.length == 2) {
            await block.setRank("Species")
        } else if (names.length == 3) {
            await block.setRank("Subspecies")
        } else {
            await block.setRank("Variety")
        }
        const myTaxon = await this.taxa.save(block)
        console.log("GOT PAST MYTAXON SAVE")
        const status = new TaxonomicStatusInputDto({
            taxonID: myTaxon.id,
            taxonIDAccepted: myTaxon.id,
            taxonAuthorityID: params.taxonAuthorityID,
            parentTaxonID: parentTaxon.id,
            hierarchyStr: null,
            family: params.family,
            unacceptabilityReason: null,
            notes: null,
            initialTimestamp: new Date()
        })

        const myStatus = await this.taxonStatus.create(status)
        await this.taxonStatus.save(myStatus)

        // Let's take care of the taxa enum tree
        await myTaxon.setAncestors(this.taxaEnumTree, this.taxonomicAuthorityID, parentTaxon)

    }

    private async onCSVComplete(uid: number, collectionID: number) {
        await this.collectionStatsUpdateQueue.add({ collectionID });
        await this.notifications.save({
            uid,
            message: `Your upload to collectionID ${collectionID} has completed`
        });
    }
}
