import {
    ApiCollectionArchive,
} from '@symbiota2/data-access';

export class CollectionArchive implements ApiCollectionArchive {
    constructor(data: Record<string, unknown>) {
        Object.assign(this, data);

    }

    collectionID: number;
    archive: string;
    isPublic: boolean;
    updatedAt: Date;
    size: number;
}
