import { Process, Processor } from '@nestjs/bull';
import { QUEUE_ID_OCCURRENCE_UPLOAD_CLEANUP } from './occurrence-upload-cleanup.queue';
import { Job } from 'bull';
import { Inject, Logger } from '@nestjs/common';
import { promises as fsPromises } from 'fs';
import { fileExists } from '@symbiota2/api-common';
import { OccurrenceUpload } from '@symbiota2/api-database';
import { Repository } from 'typeorm';

export interface OccurrenceUploadCleanupJob {
    id: number;
    deleteAfter: Date;
}

@Processor(QUEUE_ID_OCCURRENCE_UPLOAD_CLEANUP)
export class OccurrenceUploadCleanupProcessor {
    constructor(
        @Inject(OccurrenceUpload.PROVIDER_ID)
        private readonly uploads: Repository<OccurrenceUpload>) { }

    private readonly logger = new Logger(OccurrenceUploadCleanupProcessor.name);

    @Process()
    async cleanup(job: Job<OccurrenceUploadCleanupJob>) {
        const deleteAfter = new Date(job.data.deleteAfter);
        const now = Date.now();
        const deleteInMillis = Math.max(0, deleteAfter.getTime() - now);

        await OccurrenceUploadCleanupProcessor.sleep(deleteInMillis).then(async () => {
            const upload = await this.uploads.findOne(job.data.id);

            this.logger.log(`Deleting stale upload '${upload.filePath}'`);
            if (await fileExists(upload.filePath)) {
                await fsPromises.unlink(upload.filePath);
            }
            await this.uploads.delete({ id: upload.id });
        });
    }

    private static sleep(ms: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), ms);
        });
    }
}
