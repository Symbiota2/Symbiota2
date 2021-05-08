export interface ApiCollectionInstitutionOutput {
    id: number;
    name: string;
}

export interface ApiCollectionStatsOutput {
    familyCount: number;
    genusCount: number;
    speciesCount: number;
    recordCount: number;
    georeferencedCount: number;
    lastModifiedTimestamp: Date;
}

export interface ApiCollectionListItem {
    id: number;
    collectionName: string;
    icon: string;
}

export interface ApiCollectionOutput extends ApiCollectionListItem {
    collectionCode: string;
    institution: ApiCollectionInstitutionOutput;
    stats: ApiCollectionStatsOutput;
    fullDescription: string;
    homePage: string;
    individualUrl: string;
    contact: string;
    email: string;
    latitude: number;
    longitude: number;
    type: string;
    managementType: string;
    rightsHolder: string;
    rights: string;
    usageTerm: string;
    accessRights: string;
    initialTimestamp: Date;
}

export interface ApiCollectionInput {
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
}
