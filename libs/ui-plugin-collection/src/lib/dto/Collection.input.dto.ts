import { ApiCollectionInput } from '@symbiota2/data-access';

export class CollectionInputDto implements ApiCollectionInput {
    constructor(data: Record<string, unknown>) {
        Object.assign(this, data);
    }

    collectionCode: string;
    collectionName: string;
    institutionID: number;
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
    initialTimestamp: string;
}
