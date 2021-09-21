export type DwCAParseCallback<T> = (tmpdir: string, archive: DwCAMeta) => Promise<T>;

/*
All interfaces prefixed by DwCAMeta come from the archive schema defined at
https://dwc.tdwg.org/text/tdwg_dwc_text.xsd
Helpful: http://tools.gbif.org/dwca-assistant/gbif_dwc-a_asst_en_v1.1.pdf
 */

/*
The full meta.xml for a dwc archive
 */
export interface DwCAMeta {
    archive: {
        $: {
            xmlns: string;
            metadata?: string;
            "xmlns:xsi": string;
            "xsi:schemaLocation": string;
        }
        core: DwCAMetaCoreFileType[];
        extension?: DwCAMetaExtensionFileType[];
    }
}

/*
A core file within the archive
 */
export interface DwCAMetaCoreFileType extends DwCAMetaFileType {
    id?: DwCAMetaIDFieldType;
    files: DwCAMetaFileType[];
    field: DwCAMetaFieldType[];
}

/*
An extension file within the archive
 */
export interface DwCAMetaExtensionFileType extends DwCAMetaFileType {
    coreid: DwCAMetaIDFieldType[];
    field: DwCAMetaFieldType[];
}

/*
Attributes shared across all file types, core or extensions
 */
export interface DwCAMetaFileType {
    $: {
        rowType: 'Occurrence' | 'Taxon';
        dateFormat?: string;
        encoding?: string;
        fieldsTerminatedBy?: string;
        linesTerminatedBy?: string;
        fieldsEnclosedBy?: string;
        ignoreHeaderLines?: number;
    }
}

/*
A field within one of the archive data files
 */
export interface DwCAMetaFieldType {
    $: {
        term: string;
        index?: number;
        default?: string;
        vocabulary?: string;
        delimitedBy?: string;
    }
}

/*
Defines the column that's the primary key for the given file
 */
export interface DwCAMetaIDFieldType {
    $: {
        index?: number;
    }
}

/*
List of data files within the archive
 */
export interface DwCAMetaFileType {
    location: string[];
}

// https://dwc.tdwg.org/terms

export interface DwCEvent {
    eventID: string;
    parentEventID: string;
    fieldNumber: string;
    eventDate: Date;
    eventTime: Date;
    startDayOfYear: number;
    endDayOfYear: number;
    year: number;
    month: number;
    day: number;
    verbatimEventDate: string;
    habitat: string;
    samplingProtocol: string;
    sampleSizeValue: number;
    sampleSizeUnit: string;
    samplingEffort: string;
    fieldNotes: string;
    eventRemarks: string;
}

export interface DwCRecord {
    accessRights: string;
    basisOfRecord: string;
    bibliographicCitation: string;
    collectionCode: string;
    collectionID: string;
    dataGeneralizations: string;
    datasetID: string;
    datasetName: string;
    dynamicProperties: Record<string, string>;
    informationWithheld: string;
    institutionCode: string;
    institutionID: string;
    language: string;
    license: string;
    modified: Date;
    ownerInstitutionCode: string;
    references: string;
    rightsHolder: string;
    type: 'StillImage' | 'MovingImage' | 'Sound' | 'PhysicalObject' | 'Event' | 'Text';
}

export interface DwCIdentification {
    identificationID: string | number;
    verbatimIdentification: string;
    identificationQualifier: string;
    typeStatus: string;
    identifiedBy: string;
    identifiedByID: string[];
    dateIdentified: Date;
    identificationReferences: string[];
    identificationVerificationStatus: string;
    identificationRemarks: string;
}

export interface DwCLocation {
    continent: string;
    coordinatePrecision: number;
    coordinateUncertaintyInMeters: number;
    country: string;
    countryCode: string;
    county: string;
    decimalLatitude: number;
    decimalLongitude: number;
    footprintSpatialFit: string;
    footprintSRS: string;
    footprintWKT: string;
    geodeticDatum: string;
    georeferencedBy: string;
    georeferencedDate: Date;
    georeferenceProtocol: string;
    georeferenceRemarks: string;
    georeferenceSources: string;
    higherGeographicID: string;
    island: string;
    islandGroup: string;
    locality: string;
    locationAccordingTo: string;
    locationID: string;
    locationRemarks: string;
    maximumDepthInMeters: number;
    maximumDistanceAboveSurfaceInMeters: number;
    maximumElevationInMeters: number;
    minimumDepthInMeters: number;
    minimumDistanceAboveSurfaceInMeters: number;
    minimumElevationInMeters: number;
    municipality: string;
    pointRadiusSpatialFit: number;
    stateProvince: string;
    verbatimCoordinates: string;
    verbatimCoordinateSystem: string;
    verbatimDepth: string;
    verbatimElevation: string;
    verbatimLatitude: string;
    verbatimLocality: string;
    verbatimLongitude: string;
    verbatimSRS: string;
    verticalDatum: string;
    waterBody: string;
}

export interface DwCOccurrence {
    associatedMedia: string;
    associatedOccurrences: Record<string, string>;
    associatedReferences: string[];
    associatedTaxa: Record<string, string>;
    assoicatedSequences: string[];
    behavior: string;
    catalogNumber: string;
    degreeOfEstablishment: string;
    disposition: string;
    establishmentMeans: string;
    georeferenceVerificationStatus: string;
    individualCount: number;
    lifeStage: string;
    occurrenceID: string;
    occurrenceRemarks: string;
    occurrenceStatus: string;
    organismQuantity: number;
    organismQuantityType: string;
    otherCatalogNumbers: string;
    pathway: string;
    preparations: string;
    recordedBy: string;
    recordedByID: string;
    recordNumber: string;
    reproductiveCondition: string;
    sex: string;
}

export interface DwcTaxon {
    acceptedNameUsage: string;
    acceptedNameUsageID: string;
    class: string;
    cultivarEpithet: string;
    family: string;
    genericName: string;
    genus: string;
    higherClassification: string[];
    infragenericEpithet: string;
    infraspecificEpithet: string;
    kingdom: string;
    nameAccordingTo: string;
    nameAccordingToID: string;
    namePublishedIn: string;
    namePublishedInID: string;
    namePublishedInYear: number;
    nomenclaturalCode: string;
    nomenclaturalStatus: string;
    order: string;
    originalNameUsage: string;
    originalNameUsageID: string;
    parentNameUsage: string;
    parentNameUsageID: string;
    phylum: string;
    scientificName: string;
    scientificNameAuthorship: string;
    scientificNameID: string;
    specificEpithet: string;
    subfamily: string;
    subgenus: string;
    taxonConceptID: string;
    taxonID: string;
    taxonomicStatus: string;
    taxonRank: string;
    taxonRemarks: string;
    verbatimTaxonRank: string;
    vernacularName: string;
}

