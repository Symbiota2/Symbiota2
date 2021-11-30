import { BullModule } from '@nestjs/bull';

export const QUEUE_ID_TAXONOMY_UPLOAD = 'taxonomyUpload';
export const TaxonomyUploadQueue = BullModule.registerQueue({ name: QUEUE_ID_TAXONOMY_UPLOAD });

