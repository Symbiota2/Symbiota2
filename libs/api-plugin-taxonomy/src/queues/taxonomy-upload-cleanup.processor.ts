import { Process, Processor } from '@nestjs/bull';
import { QUEUE_ID_TAXONOMY_UPLOAD_CLEANUP } from './taxonomy-upload-cleanup.queue';
import { Job } from 'bull';
import { Inject, Logger } from '@nestjs/common';
import { promises as fsPromises } from 'fs';
import { fileExists } from '@symbiota2/api-common';
import { Repository } from 'typeorm';
import { TaxonomyUpload } from '../../../api-database/src/entities/upload/TaxonomyUpload.entity';

export interface TaxonomyUploadCleanupJob {
    id: number;
    deleteAfter: Date;
}

@Processor(QUEUE_ID_TAXONOMY_UPLOAD_CLEANUP)
export class TaxonomyUploadCleanupProcessor {
    constructor(
        @Inject(TaxonomyUpload.PROVIDER_ID)
        private readonly uploads: Repository<TaxonomyUpload>) { }

    private readonly logger = new Logger(TaxonomyUploadCleanupProcessor.name);

    @Process()
    async cleanup(job: Job<TaxonomyUploadCleanupJob>) {
        const deleteAfter = new Date(job.data.deleteAfter);
        const now = Date.now();
        const deleteInMillis = Math.max(0, deleteAfter.getTime() - now);

        await TaxonomyUploadCleanupProcessor.sleep(deleteInMillis).then(async () => {
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
