import { ApiPublishedCollection } from "@symbiota2/data-access";


export class PublishedCollection implements ApiPublishedCollection{
    constructor(data: Record<string, unknown>) {
        Object.assign(this, data);
    }

    collectionID: number;
    archive: string;
}