import { BullModule } from '@nestjs/bull';

export const QUEUE_ID_OCCURRENCE_UPLOAD = 'occurrenceUpload';
export const OccurrenceUploadQueue = BullModule.registerQueue({ name: QUEUE_ID_OCCURRENCE_UPLOAD });

