import { BullModule } from '@nestjs/bull';

export interface CollectionStatsUpdateJob {
    collectionID: number;
}

export const QUEUE_ID_COLLECTION_STATS_UPDATE = 'queueCollectionStatus';
export const CollectionStatsUpdateQueue = BullModule.registerQueue({ name: QUEUE_ID_COLLECTION_STATS_UPDATE });
