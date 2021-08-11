import {
    ApiCollectionInstitutionOutput,
    ApiCollectionListItem, ApiCollectionOutput, ApiCollectionStatsOutput
} from '@symbiota2/data-access';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CollectionListItem implements ApiCollectionListItem {
    constructor(collection: ApiCollectionListItem) {
        Object.assign(this, collection);
    }

    @Expose() id: number;
    @Expose() collectionName: string;
    @Expose() icon: string;
    @Expose() collectionCode: string;
}

@Exclude()
export class Collection extends CollectionListItem implements ApiCollectionOutput {
    constructor(collection: ApiCollectionOutput) {
        super(collection);
    }

    @Expose() stats: ApiCollectionStatsOutput;
    @Expose() institution: ApiCollectionInstitutionOutput;
    @Expose() fullDescription: string;
    @Expose() homePage: string;
    @Expose() individualUrl: string;
    @Expose() contact: string;
    @Expose() email: string;
    @Expose() latitude: number;
    @Expose() longitude: number;
    @Expose() type: string;
    @Expose() managementType: string;
    @Expose() rightsHolder: string;
    @Expose() rights: string;
    @Expose() usageTerm: string;
    @Expose() accessRights: string;
    @Expose() initialTimestamp: Date;
}
