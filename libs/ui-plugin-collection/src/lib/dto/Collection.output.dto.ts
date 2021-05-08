import {
    ApiCollectionInstitutionOutput,
    ApiCollectionListItem, ApiCollectionOutput, ApiCollectionStatsOutput
} from '@symbiota2/data-access';

export class CollectionListItem implements ApiCollectionListItem {
    constructor(collection: ApiCollectionListItem) {
        Object.assign(this, collection);
    }

    id: number;
    collectionName: string;
    icon: string;
}

export class Collection implements ApiCollectionOutput {
    constructor(collection: ApiCollectionOutput) {
        Object.assign(this, collection);
    }

    id: number;
    collectionCode: string;
    collectionName: string;
    institution: ApiCollectionInstitutionOutput;
    stats: ApiCollectionStatsOutput;
    fullDescription: string;
    homePage: string;
    individualUrl: string;
    contact: string;
    email: string;
    latitude: number;
    longitude: number;
    icon: string;
    type: string;
    managementType: string;
    rightsHolder: string;
    rights: string;
    usageTerm: string;
    accessRights: string;
    initialTimestamp: Date;
}
