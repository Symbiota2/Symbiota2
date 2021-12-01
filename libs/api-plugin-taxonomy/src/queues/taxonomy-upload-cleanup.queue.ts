import { BullModule } from '@nestjs/bull';

export const QUEUE_ID_TAXONOMY_UPLOAD_CLEANUP = 'taxonomyUploadCleanup';
export const TaxonomyUploadCleanupQueue = BullModule.registerQueue({ name: QUEUE_ID_TAXONOMY_UPLOAD_CLEANUP });
