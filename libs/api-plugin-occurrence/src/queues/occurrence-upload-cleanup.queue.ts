import { BullModule } from '@nestjs/bull';

export const QUEUE_ID_OCCURRENCE_UPLOAD_CLEANUP = 'occurrenceUploadCleanup';
export const OccurrenceUploadCleanupQueue = BullModule.registerQueue({ name: QUEUE_ID_OCCURRENCE_UPLOAD_CLEANUP });
