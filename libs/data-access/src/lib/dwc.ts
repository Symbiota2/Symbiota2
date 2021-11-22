export interface ApiPublishedCollection {
    collectionID: number;
    archive: string;
}

export interface ApiCollectionArchive {

    collectionID: number,
    archive: string,
    isPublic: boolean,
    updatedAt: Date,
    size: number
}
