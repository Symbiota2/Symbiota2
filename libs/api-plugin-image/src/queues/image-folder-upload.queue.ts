import { BullModule } from '@nestjs/bull';

export const QUEUE_ID_IMAGE_FOLDER_UPLOAD = 'ImageFolderUpload';
export const ImageFolderUploadQueue = BullModule.registerQueue({ name: QUEUE_ID_IMAGE_FOLDER_UPLOAD });
