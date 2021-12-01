import {
    ApiCollectionArchive,
    ApiPublishedCollection,
} from '@symbiota2/data-access';

export class PublishedCollection implements ApiPublishedCollection {
    constructor(data: Record<string, unknown>) {
        Object.assign(this, data);
    }

    collectionID: number;
    archive: string;
}

export class CollectionArchive implements ApiCollectionArchive {
    constructor(data: Record<string, unknown>) {
        Object.assign(this, data);

        this.updatedAt = new Date(this.updatedAt);
    }

    collectionID: number;
    archive: string;
    isPublic: boolean;
    updatedAt: Date;
    size: number;
}
