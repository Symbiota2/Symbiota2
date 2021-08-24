export interface ApiCollectionInstitutionOutput {
    id: number;
    code: string;
    name: string;
}

export interface ApiInstitutionOutput extends ApiCollectionInstitutionOutput {
    address1: string;
    address2: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    country: string;
    phone: string;
    contact: string;
    email: string;
    url: string;
    notes: string;
    initialTimestamp: string | Date;
}

export interface ApiInstitutionInput{
    code: string;
    name: string
    address1: string;
    address2: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    country: string;
    phone: string;
    contact: string;
    email: string;
    url: string;
    notes: string;
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
    collectionCode: string;
    collectionName: string;
    icon: string;
}

export interface ApiCollectionOutput extends ApiCollectionListItem {
    collectionCode: string;
    institution: ApiCollectionInstitutionOutput;
    collectionStats: ApiCollectionStatsOutput;
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
