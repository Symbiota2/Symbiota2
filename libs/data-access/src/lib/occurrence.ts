import { ApiListResults } from './common';
import { ApiCollectionListItem } from './collection';

export enum ApiTaxonSearchCriterion {
    familyOrSciName = 'familyOrSciName',
    scientificName = 'scientificName',
    family = 'family',
    higherTaxonomy = 'higherTaxonomy',
    commonName = 'commonName'
}

export interface ApiOccurrenceFindAllParams {
    collectionID: number[];
    limit: number;
    offset: number;

    // Taxon criteria
    taxonSearchCriterion: ApiTaxonSearchCriterion;
    taxonSearchStr: string;

    // Locality criteria
    country: string;
    stateProvince: string;
    county: string;
    locality: string;
    minimumElevationInMeters: number;
    maximumElevationInMeters: number;
    minLatitude: number;
    minLongitude: number;
    maxLatitude: number;
    maxLongitude: number;

    // Collector criteria
    collectorLastName: string;
    minEventDate: Date | string;
    maxEventDate: Date | string;

    // Specimen criteria
    catalogNumber: string;

    // Filters
    limitToSpecimens: boolean;
    limitToImages: boolean;
    limitToGenetic: boolean;

    geoJSON?: string;
}

export interface ApiOccurrenceListItem {
    id: number;
    collection: ApiCollectionListItem;
    catalogNumber: string;
    taxonID: number | null;
    scientificName: string;
    latitude: number | null;
    longitude: number | null;
}

export interface ApiOccurrenceList extends ApiListResults<ApiOccurrenceListItem> { }

export interface ApiOccurrence extends ApiOccurrenceListItem {
    associatedCollectors: string;
    associatedOccurrences: string;
    associatedTaxa: string;
    basisOfRecord: string;
    behavior: string;
    collectionIDStr: string;
    coordinatePrecision: number;
    coordinateUncertaintyInMeters: number | null;
    country: string;
    county: string;
    cultivationStatus: number | null;
    dataGeneralizations: string;
    datasetID: string;
    dateIdentified: Date | null;
    dbpk: string;
    disposition: string;
    duplicateQuantity: number | null;
    dynamicFields: string;
    dynamicProperties: string;
    endDayOfYear: number | null;
    establishmentMeans: string;
    eventDate: Date | null;
    eventID: string;
    family: string;
    fieldNotes: string;
    fieldNumber: string;
    footprintWKT: string;
    genericColumn1: string;
    genericColumn2: string;
    genus: string;
    geodeticDatum: string;
    georeferencedBy: string;
    georeferenceProtocol: string;
    georeferenceRemarks: string;
    georeferenceSources: string;
    georeferenceVerificationStatus: string;
    habitat: string;
    identificationQualifier: string;
    identificationReferences: string;
    identificationRemarks: string;
    identifiedBy: string;
    individualCount: string;
    informationWithheld: string;
    infraspecificEpithet: string;
    initialTimestamp: Date | null;
    institutionID: string;
    labelProject: string;
    language: string;
    lastModifiedTimestamp: Date;
    latestDateCollected: string;
    lifeStage: string;
    locality: string;
    localitySecurity: number | null;
    localitySecurityReason: string;
    locationID: string;
    locationRemarks: string;
    maximumDepthInMeters: number | null;
    maximumElevationInMeters: number | null;
    minimumDepthInMeters: number | null;
    minimumElevationInMeters: number | null;
    modified: Date | null;
    municipality: string;
    observerUID: number | null;
    occurrenceGUID: string;
    occurrenceRemarks: string;
    otherCatalogNumbers: string;
    ownerInstitutionCode: string;
    preparations: string;
    previousIdentifications: string;
    processingStatus: string;
    recordedByID: string;
    recordedByNames: string;
    recordEnteredBy: string;
    recordNumber: string;
    reproductiveCondition: string;
    samplingEffort: string;
    samplingProtocol: string;
    scientificName: string;
    sex: string;
    specificEpithet: string;
    startDayOfYear: number | null;
    stateProvince: string;
    storageLocation: string;
    substrate: string;
    taxonRank: string;
    taxonRemarks: string;
    typeStatus: string;
    verbatimAttributes: string;
    verbatimCoordinates: string;
    verbatimCoordinateSystem: string;
    verbatimDepth: string;
    verbatimElevation: string;
    verbatimEventDate: string;
    waterBody: string;
}

export interface ApiOccurrenceUpload {
    id: number;
    fieldMap: Record<string, string>;
}

export interface ApiOccurrenceMapUploadFieldsBody {
    uniqueIDField: string;
    fieldMap: Record<string, string>;
}
