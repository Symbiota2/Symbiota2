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
    OccurrenceUpload, TaxaEnumTreeEntry, Taxon, TaxonomicUnit,
    UserNotification
} from '@symbiota2/api-database';
import { DeepPartial, Repository } from 'typeorm';
import { QUEUE_ID_TAXONOMY_UPLOAD } from './taxonomy-upload.queue';
import { csvIterator } from '@symbiota2/api-common';

export interface TaxonomyUploadJob {
    uid: number;
    collectionID: number;
    uploadID: number;
}

@Processor(QUEUE_ID_TAXONOMY_UPLOAD)
export class TaxonomyUploadProcessor {
    private processed = 0;
    private readonly logger = new Logger(TaxonomyUploadProcessor.name);

    constructor(
        @Inject(OccurrenceUpload.PROVIDER_ID)
        private readonly uploads: Repository<OccurrenceUpload>,
        @Inject(UserNotification.PROVIDER_ID)
        private readonly notifications: Repository<UserNotification>,
        @Inject(Taxon.PROVIDER_ID)
        private readonly taxa: Repository<Taxon>,
        @Inject(TaxonomicUnit.PROVIDER_ID)
        private readonly taxonRanks: Repository<TaxonomicUnit>,
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
                await this.onCSVComplete(job.data.uid, job.data.collectionID);
            } catch (e) {
                await job.moveToFailed(e);
            }
        }
    }

    @OnQueueCompleted()
    async queueCompletedHandler(job: Job) {
        this.logger.log(`Upload complete for taxa authority ID ${job.data.collectionID}`);
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

    private async onCSVBatch(job: Job<TaxonomyUploadJob>, upload: OccurrenceUpload, batch: DeepPartial<Taxon>[]) {
        const allTaxonUpdates = [];

        for (const taxonRow of batch) {
            const taxonData = {};

            for (const [csvField, dbField] of Object.entries(upload.fieldMap)) {
                if (!dbField) {
                    continue;
                }
                const csvValue = taxonRow[csvField];
                taxonData[dbField] = csvValue === '' ? null : csvValue;
            }

            const dbIDField = upload.fieldMap[upload.uniqueIDField];
            const uniqueValue = taxonData[dbIDField];

            // Without a unique value for the row, skip it
            if (!uniqueValue) {
                continue;
            }

            // Hard code based on job's collection ID
            //taxonData['collectionID'] = job.data.collectionID;

            const dbTaxon = await this.taxa.findOne({
                [dbIDField]: uniqueValue
            });

            // We need to get rid of this; If it's already in the db, then
            // dbTaxon has it; If it's not, we'll generate a new one
            delete taxonData['taxonID']

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
                const taxon = this.taxa.create(taxonData);
                allTaxonUpdates.push(taxon);
            }
        }

        await this.taxa.save(allTaxonUpdates);
        this.processed += allTaxonUpdates.length;

        let logMsg = `Processing uploads for taxa authority ID ${job.data.collectionID} `;
        logMsg += `(${new Intl.NumberFormat().format(this.processed)} processed)...`;
        this.logger.log(logMsg);
    }

    private async onCSVComplete(uid: number, collectionID: number) {
        await this.notifications.save({
            uid,
            message: `Your upload to taxa authority ID ${collectionID} has completed`
        });
    }
}
