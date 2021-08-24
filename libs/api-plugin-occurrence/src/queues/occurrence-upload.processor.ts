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
    OccurrenceUpload, TaxaEnumTreeEntry, Taxon, TaxonomicUnit,
    UserNotification
} from '@symbiota2/api-database';
import { DeepPartial, Repository } from 'typeorm';
import { QUEUE_ID_OCCURRENCE_UPLOAD } from './occurrence-upload.queue';
import { csvIterator } from '@symbiota2/api-common';
import {
    CollectionStatsUpdateJob,
    QUEUE_ID_COLLECTION_STATS_UPDATE
} from '@symbiota2/api-plugin-collection';

export interface OccurrenceUploadJob {
    uid: number;
    collectionID: number;
    uploadID: number;
}

@Processor(QUEUE_ID_OCCURRENCE_UPLOAD)
export class OccurrenceUploadProcessor {
    private processed = 0;
    private readonly logger = new Logger(OccurrenceUploadProcessor.name);

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
        @Inject(TaxonomicUnit.PROVIDER_ID)
        private readonly taxonRanks: Repository<TaxonomicUnit>,
        @Inject(TaxaEnumTreeEntry.PROVIDER_ID)
        private readonly taxaEnumTree: Repository<TaxaEnumTreeEntry>,
        @InjectQueue(QUEUE_ID_COLLECTION_STATS_UPDATE)
        private readonly collectionStatsUpdateQueue: Queue<CollectionStatsUpdateJob>) { }

    // TODO: Wrap in a transaction? Right now each chunk goes straight to the database until a failure occurs
    @Process()
    async upload(job: Job<OccurrenceUploadJob>): Promise<void> {
        this.processed = 0;

        const upload = await this.uploads.findOne(job.data.uploadID);
        if (!upload) {
            return;
        }
        this.logger.log(`Upload of '${upload.filePath}' started...`);

        let error: Error = null;
        for await (const batch of csvIterator<DeepPartial<Occurrence>>(upload.filePath)) {
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

    private async onCSVBatch(job: Job<OccurrenceUploadJob>, upload: OccurrenceUpload, batch: DeepPartial<Occurrence>[]) {
        const allOccurrenceUpdates = [];

        for (const occurrenceRow of batch) {
            const occurrenceData = {};

            for (const [csvField, dbField] of Object.entries(upload.fieldMap)) {
                if (!dbField) {
                    continue;
                }
                const csvValue = occurrenceRow[csvField];
                occurrenceData[dbField] = csvValue === '' ? null : csvValue;
            }

            const dbIDField = upload.fieldMap[upload.uniqueIDField];
            const currenceOccurrenceUniqueValue = occurrenceData[dbIDField];

            // Without a unique value for the row, skip it
            if (!currenceOccurrenceUniqueValue) {
                continue;
            }

            // Hard code based on job's collection ID
            occurrenceData['collectionID'] = job.data.collectionID;

            const dbOccurrence = await this.occurrences.findOne({
                [dbIDField]: currenceOccurrenceUniqueValue
            });

            // We need to get rid of this; If it's already in the db, then
            // dbOccurrence has it; If it's not, we'll generate a new one
            delete occurrenceData['id'];

            // This is also generated; see occurrence entity
            delete occurrenceData['taxonID'];

            // Update
            if (dbOccurrence) {
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

        await this.occurrences.save(allOccurrenceUpdates);
        this.processed += allOccurrenceUpdates.length;

        let logMsg = `Processing uploads for collectionID ${job.data.collectionID} `;
        logMsg += `(${new Intl.NumberFormat().format(this.processed)} processed)...`;
        this.logger.log(logMsg);
    }

    private async onCSVComplete(uid: number, collectionID: number) {
        await this.collectionStatsUpdateQueue.add({ collectionID });
        await this.notifications.save({
            uid,
            message: `Your upload to collectionID ${collectionID} has completed`
        });
    }
}
