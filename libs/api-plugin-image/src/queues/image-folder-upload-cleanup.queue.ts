import { BullModule } from '@nestjs/bull';

export const QUEUE_ID_IMAGE_FOLDER_UPLOAD_CLEANUP = 'imageFolderUploadCleanup';
export const ImageFolderUploadCleanupQueue = BullModule.registerQueue({ name: QUEUE_ID_IMAGE_FOLDER_UPLOAD_CLEANUP });
