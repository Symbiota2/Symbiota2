import { Process, Processor } from '@nestjs/bull';
import { QUEUE_ID_IMAGE_FOLDER_UPLOAD_CLEANUP } from './image-folder-upload-cleanup.queue';
import { Job } from 'bull';
import { Inject, Logger } from '@nestjs/common';
import { promises as fsPromises } from 'fs';
import { fileExists } from '@symbiota2/api-common';
import { Repository } from 'typeorm';
import { ImageFolderUpload } from '../../../api-database/src/entities/upload/ImageFolderUpload.entity';

export interface ImageFolderUploadCleanupJob {
    id: number;
    deleteAfter: Date;
}

@Processor(QUEUE_ID_IMAGE_FOLDER_UPLOAD_CLEANUP)
export class ImageFolderUploadCleanupProcessor {
    constructor(
        @Inject(ImageFolderUpload.PROVIDER_ID)
        private readonly uploads: Repository<ImageFolderUpload>) { }

    private readonly logger = new Logger(ImageFolderUploadCleanupProcessor.name);

    @Process()
    async cleanup(job: Job<ImageFolderUploadCleanupJob>) {
        const deleteAfter = new Date(job.data.deleteAfter);
        const now = Date.now();
        const deleteInMillis = Math.max(0, deleteAfter.getTime() - now);

        await ImageFolderUploadCleanupProcessor.sleep(deleteInMillis).then(async () => {
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
