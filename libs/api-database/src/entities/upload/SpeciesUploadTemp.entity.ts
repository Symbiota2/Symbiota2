import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Collection } from '../collection';
import { EntityProvider } from '../../entity-provider.class';

@Index(['collectionID'])
@Index('Index_uploadspectemp_occid', ['occurrenceID'])
@Index('Index_uploadspectemp_dbpk', ['dbpk'])
@Index('Index_uploadspec_sciname', ['sciname'])
@Index('Index_uploadspec_catalognumber', ['catalogNumber'])
@Entity('uploadspectemp')
export class SpeciesUploadTemp extends EntityProvider {
    @PrimaryGeneratedColumn({ name: 'id', unsigned: true })
    id: number;

    @Column('int', { name: 'collid', unsigned: true })
    collectionID: number;

    // TODO: Better name
    @Column('varchar', { name: 'dbpk', nullable: true, length: 150 })
    dbpk: string;

    @Column('int', { name: 'occid', nullable: true, unsigned: true })
    occurrenceID: number | null;

    @Column('varchar', {
        name: 'basisOfRecord',
        nullable: true,
        comment: 'PreservedSpecimen, LivingSpecimen, HumanObservation',
        length: 32,
        default: () => '\'PreservedSpecimen\'',
    })
    basisOfRecord: string;

    @Column('varchar', {
        name: 'occurrenceID',
        nullable: true,
        comment: 'UniqueGlobalIdentifier',
        length: 255,
    })
    occurrenceGUID: string;

    @Column('varchar', { name: 'catalogNumber', nullable: true, length: 32 })
    catalogNumber: string;

    @Column('varchar', {
        name: 'otherCatalogNumbers',
        nullable: true,
        length: 255,
    })
    otherCatalogNumbers: string;

    @Column('varchar', {
        name: 'ownerInstitutionCode',
        nullable: true,
        length: 32,
    })
    ownerInstitutionCode: string;

    @Column('varchar', { name: 'institutionID', nullable: true, length: 255 })
    institutionIDStr: string;

    @Column('varchar', { name: 'collectionID', nullable: true, length: 255 })
    collectionIDStr: string;

    @Column('varchar', { name: 'datasetID', nullable: true, length: 255 })
    datasetIDStr: string;

    @Column('varchar', { name: 'institutionCode', nullable: true, length: 64 })
    institutionCode: string;

    @Column('varchar', { name: 'collectionCode', nullable: true, length: 64 })
    collectionCode: string;

    @Column('varchar', { name: 'family', nullable: true, length: 255 })
    family: string;

    @Column('varchar', { name: 'scientificName', nullable: true, length: 255 })
    scientificName: string;

    // TODO: What's the difference? Better naming
    @Column('varchar', { name: 'sciname', nullable: true, length: 255 })
    sciname: string;

    @Column('int', { name: 'tidinterpreted', nullable: true, unsigned: true })
    interpretedTaxonID: number | null;

    @Column('varchar', { name: 'genus', nullable: true, length: 255 })
    genus: string;

    @Column('varchar', { name: 'specificEpithet', nullable: true, length: 255 })
    specificEpithet: string;

    @Column('varchar', { name: 'taxonRank', nullable: true, length: 32 })
    taxonRank: string;

    @Column('varchar', {
        name: 'infraspecificEpithet',
        nullable: true,
        length: 255,
    })
    infraspecificEpithet: string;

    @Column('varchar', {
        name: 'scientificNameAuthorship',
        nullable: true,
        length: 255,
    })
    scientificNameAuthorship: string;

    @Column('text', { name: 'taxonRemarks', nullable: true })
    taxonRemarks: string;

    @Column('varchar', { name: 'identifiedBy', nullable: true, length: 255 })
    identifiedBy: string;

    @Column('varchar', { name: 'dateIdentified', nullable: true, length: 45 })
    dateIdentified: string;

    @Column('text', { name: 'identificationReferences', nullable: true })
    identificationReferences: string;

    @Column('text', { name: 'identificationRemarks', nullable: true })
    identificationRemarks: string;

    @Column('varchar', {
        name: 'identificationQualifier',
        nullable: true,
        comment: 'cf, aff, etc',
        length: 255,
    })
    identificationQualifier: string;

    @Column('varchar', { name: 'typeStatus', nullable: true, length: 255 })
    typeStatus: string;

    @Column('varchar', {
        name: 'recordedBy',
        nullable: true,
        comment: 'Collector(s)',
        length: 255,
    })
    recordedBy: string;

    @Column('varchar', {
        name: 'recordNumberPrefix',
        nullable: true,
        length: 45
    })
    recordNumberPrefix: string;

    @Column('varchar', {
        name: 'recordNumberSuffix',
        nullable: true,
        length: 45
    })
    recordNumberSuffix: string;

    @Column('varchar', {
        name: 'recordNumber',
        nullable: true,
        comment: 'Collector Number',
        length: 32,
    })
    recordNumber: string;

    @Column('varchar', {
        name: 'CollectorFamilyName',
        nullable: true,
        comment: 'not DwC',
        length: 255,
    })
    collectorFamilyName: string;

    @Column('varchar', {
        name: 'CollectorInitials',
        nullable: true,
        comment: 'not DwC',
        length: 255,
    })
    collectorInitials: string;

    @Column('varchar', {
        name: 'associatedCollectors',
        nullable: true,
        comment: 'not DwC',
        length: 255,
    })
    associatedCollectors: string;

    @Column('date', { name: 'eventDate', nullable: true })
    eventDate: string;

    @Column('int', { name: 'year', nullable: true })
    year: number | null;

    @Column('int', { name: 'month', nullable: true })
    month: number | null;

    @Column('int', { name: 'day', nullable: true })
    day: number | null;

    @Column('int', { name: 'startDayOfYear', nullable: true })
    startDayOfYear: number | null;

    @Column('int', { name: 'endDayOfYear', nullable: true })
    endDayOfYear: number | null;

    @Column('date', { name: 'LatestDateCollected', nullable: true })
    latestDateCollected: string;

    @Column('varchar', {
        name: 'verbatimEventDate',
        nullable: true,
        length: 255
    })
    verbatimEventDate: string;

    @Column('text', {
        name: 'habitat',
        nullable: true,
        comment: 'Habitat, substrait, etc',
    })
    habitat: string;

    @Column('varchar', { name: 'substrate', nullable: true, length: 500 })
    substrate: string;

    @Column('varchar', { name: 'host', nullable: true, length: 250 })
    host: string;

    @Column('text', { name: 'fieldNotes', nullable: true })
    fieldNotes: string;

    @Column('varchar', { name: 'fieldnumber', nullable: true, length: 45 })
    fieldNumber: string;

    @Column('text', {
        name: 'occurrenceRemarks',
        nullable: true,
        comment: 'General Notes',
    })
    occurrenceRemarks: string;

    @Column('varchar', {
        name: 'informationWithheld',
        nullable: true,
        length: 250,
    })
    informationWithheld: string;

    @Column('varchar', {
        name: 'dataGeneralizations',
        nullable: true,
        length: 250,
    })
    dataGeneralizations: string;

    @Column('text', { name: 'associatedOccurrences', nullable: true })
    associatedOccurrences: string;

    @Column('text', { name: 'associatedMedia', nullable: true })
    associatedMedia: string;

    @Column('text', { name: 'associatedReferences', nullable: true })
    associatedReferences: string;

    @Column('text', { name: 'associatedSequences', nullable: true })
    associatedSequences: string;

    @Column('text', {
        name: 'associatedTaxa',
        nullable: true,
        comment: 'Associated Species',
    })
    associatedTaxa: string;

    @Column('text', {
        name: 'dynamicProperties',
        nullable: true,
        comment: 'Plant Description?',
    })
    dynamicProperties: string;

    @Column('text', { name: 'verbatimAttributes', nullable: true })
    verbatimAttributes: string;

    @Column('varchar', { name: 'behavior', nullable: true, length: 500 })
    behavior: string;

    @Column('varchar', {
        name: 'reproductiveCondition',
        nullable: true,
        comment: 'Phenology: flowers, fruit, sterile',
        length: 255,
    })
    reproductiveCondition: string;

    @Column('int', {
        name: 'cultivationStatus',
        nullable: true,
        comment: '0 = wild, 1 = cultivated',
    })
    cultivationStatus: number | null;

    @Column('varchar', {
        name: 'establishmentMeans',
        nullable: true,
        comment: 'cultivated, invasive, escaped from captivity, wild, native',
        length: 32,
    })
    establishmentMeans: string;

    @Column('varchar', { name: 'lifeStage', nullable: true, length: 45 })
    lifeStage: string;

    @Column('varchar', { name: 'sex', nullable: true, length: 45 })
    sex: string;

    @Column('varchar', { name: 'individualCount', nullable: true, length: 45 })
    individualCount: string;

    @Column('varchar', {
        name: 'samplingProtocol',
        nullable: true,
        length: 100
    })
    samplingProtocol: string;

    @Column('varchar', { name: 'samplingEffort', nullable: true, length: 200 })
    samplingEffort: string;

    @Column('varchar', { name: 'preparations', nullable: true, length: 100 })
    preparations: string;

    @Column('varchar', { name: 'country', nullable: true, length: 64 })
    country: string;

    @Column('varchar', { name: 'stateProvince', nullable: true, length: 255 })
    stateProvince: string;

    @Column('varchar', { name: 'county', nullable: true, length: 255 })
    county: string;

    @Column('varchar', { name: 'municipality', nullable: true, length: 255 })
    municipality: string;

    @Column('text', { name: 'locality', nullable: true })
    locality: string;

    @Column('int', {
        name: 'localitySecurity',
        nullable: true,
        comment: '0 = display locality, 1 = hide locality',
        default: () => '\'0\'',
    })
    localitySecurity: number | null;

    @Column('varchar', {
        name: 'localitySecurityReason',
        nullable: true,
        length: 100,
    })
    localitySecurityReason: string;

    @Column('double', {
        name: 'decimalLatitude',
        nullable: true,
        precision: 22
    })
    latitude: number | null;

    @Column('double', {
        name: 'decimalLongitude',
        nullable: true,
        precision: 22
    })
    longitude: number | null;

    @Column('varchar', { name: 'geodeticDatum', nullable: true, length: 255 })
    geodeticDatum: string;

    @Column('int', {
        name: 'coordinateUncertaintyInMeters',
        nullable: true,
        unsigned: true,
    })
    coordinateUncertaintyInMeters: number | null;

    @Column('text', { name: 'footprintWKT', nullable: true })
    footprintWKT: string;

    @Column('decimal', {
        name: 'coordinatePrecision',
        nullable: true,
        precision: 9,
        scale: 7,
    })
    coordinatePrecision: string;

    @Column('text', { name: 'locationRemarks', nullable: true })
    locationRemarks: string;

    @Column('varchar', {
        name: 'verbatimCoordinates',
        nullable: true,
        length: 255,
    })
    verbatimCoordinates: string;

    @Column('varchar', {
        name: 'verbatimCoordinateSystem',
        nullable: true,
        length: 255,
    })
    verbatimCoordinateSystem: string;

    @Column('int', { name: 'latDeg', nullable: true })
    latitudeDegrees: number | null;

    @Column('double', { name: 'latMin', nullable: true, precision: 22 })
    latitudeMin: number | null;

    @Column('double', { name: 'latSec', nullable: true, precision: 22 })
    latitudeSeconds: number | null;

    @Column('varchar', { name: 'latNS', nullable: true, length: 3 })
    latNorthSouth: string;

    @Column('int', { name: 'lngDeg', nullable: true })
    longitudeDegrees: number | null;

    @Column('double', { name: 'lngMin', nullable: true, precision: 22 })
    longitudeMin: number | null;

    @Column('double', { name: 'lngSec', nullable: true, precision: 22 })
    longitudeSeconds: number | null;

    @Column('varchar', { name: 'lngEW', nullable: true, length: 3 })
    longitudeEastWest: string;

    @Column('varchar', { name: 'verbatimLatitude', nullable: true, length: 45 })
    verbatimLatitude: string;

    @Column('varchar', {
        name: 'verbatimLongitude',
        nullable: true,
        length: 45
    })
    verbatimLongitude: string;

    @Column('varchar', { name: 'UtmNorthing', nullable: true, length: 45 })
    utmNorthing: string;

    @Column('varchar', { name: 'UtmEasting', nullable: true, length: 45 })
    utmEasting: string;

    @Column('varchar', { name: 'UtmZoning', nullable: true, length: 45 })
    utmZoning: string;

    @Column('varchar', { name: 'trsTownship', nullable: true, length: 45 })
    trsTownship: string;

    @Column('varchar', { name: 'trsRange', nullable: true, length: 45 })
    trsRange: string;

    @Column('varchar', { name: 'trsSection', nullable: true, length: 45 })
    trsSection: string;

    @Column('varchar', {
        name: 'trsSectionDetails',
        nullable: true,
        length: 45
    })
    trsSectionDetails: string;

    @Column('varchar', { name: 'georeferencedBy', nullable: true, length: 255 })
    georeferencedBy: string;

    @Column('varchar', {
        name: 'georeferenceProtocol',
        nullable: true,
        length: 255,
    })
    georeferenceProtocol: string;

    @Column('varchar', {
        name: 'georeferenceSources',
        nullable: true,
        length: 255,
    })
    georeferenceSources: string;

    @Column('varchar', {
        name: 'georeferenceVerificationStatus',
        nullable: true,
        length: 32,
    })
    georeferenceVerificationStatus: string;

    @Column('varchar', {
        name: 'georeferenceRemarks',
        nullable: true,
        length: 255,
    })
    georeferenceRemarks: string;

    @Column('int', { name: 'minimumElevationInMeters', nullable: true })
    minimumElevationInMeters: number | null;

    @Column('int', { name: 'maximumElevationInMeters', nullable: true })
    maximumElevationInMeters: number | null;

    @Column('varchar', { name: 'elevationNumber', nullable: true, length: 45 })
    elevationNumber: string;

    @Column('varchar', { name: 'elevationUnits', nullable: true, length: 45 })
    elevationUnits: string;

    @Column('varchar', {
        name: 'verbatimElevation',
        nullable: true,
        length: 255
    })
    verbatimElevation: string;

    @Column('int', { name: 'minimumDepthInMeters', nullable: true })
    minimumDepthInMeters: number | null;

    @Column('int', { name: 'maximumDepthInMeters', nullable: true })
    maximumDepthInMeters: number | null;

    @Column('varchar', { name: 'verbatimDepth', nullable: true, length: 50 })
    verbatimDepth: string;

    @Column('text', { name: 'previousIdentifications', nullable: true })
    previousIdentifications: string;

    @Column('varchar', {
        name: 'disposition',
        nullable: true,
        comment: 'Dups to',
        length: 32,
    })
    disposition: string;

    @Column('varchar', { name: 'storageLocation', nullable: true, length: 100 })
    storageLocation: string;

    @Column('varchar', { name: 'genericcolumn1', nullable: true, length: 100 })
    genericColumn1: string;

    @Column('varchar', { name: 'genericcolumn2', nullable: true, length: 100 })
    genericColumn2: string;

    @Column('int', { name: 'exsiccatiIdentifier', nullable: true })
    exsiccatiIdentifier: number | null;

    @Column('varchar', { name: 'exsiccatiNumber', nullable: true, length: 45 })
    exsiccatiNumber: string;

    @Column('varchar', { name: 'exsiccatiNotes', nullable: true, length: 250 })
    exsiccatiNotes: string;

    @Column('datetime', {
        name: 'modified',
        nullable: true,
        comment: 'DateLastModified',
    })
    lastModifiedTimestamp: Date | null;

    @Column('varchar', { name: 'language', nullable: true, length: 20 })
    language: string;

    @Column('varchar', { name: 'recordEnteredBy', nullable: true, length: 250 })
    recordEnteredBy: string;

    @Column('int', {
        name: 'duplicateQuantity',
        nullable: true,
        unsigned: true
    })
    duplicateQuantity: number | null;

    @Column('varchar', { name: 'labelProject', nullable: true, length: 45 })
    labelProject: string;

    @Column('varchar', { name: 'processingStatus', nullable: true, length: 45 })
    processingStatus: string;

    // TODO: Better names; What does each field do? What should be stored there?
    @Column('text', { name: 'tempfield01', nullable: true })
    tempField01: string;

    @Column('text', { name: 'tempfield02', nullable: true })
    tempField02: string;

    @Column('text', { name: 'tempfield03', nullable: true })
    tempField03: string;

    @Column('text', { name: 'tempfield04', nullable: true })
    tempField04: string;

    @Column('text', { name: 'tempfield05', nullable: true })
    tempfield05: string;

    @Column('text', { name: 'tempfield06', nullable: true })
    tempField06: string;

    @Column('text', { name: 'tempfield07', nullable: true })
    tempField07: string;

    @Column('text', { name: 'tempfield08', nullable: true })
    tempField08: string;

    @Column('text', { name: 'tempfield09', nullable: true })
    tempField09: string;

    @Column('text', { name: 'tempfield10', nullable: true })
    tempField10: string;

    @Column('text', { name: 'tempfield11', nullable: true })
    tempField11: string;

    @Column('text', { name: 'tempfield12', nullable: true })
    tempField12: string;

    @Column('text', { name: 'tempfield13', nullable: true })
    tempField13: string;

    @Column('text', { name: 'tempfield14', nullable: true })
    tempField14: string;

    @Column('text', { name: 'tempfield15', nullable: true })
    tempField15: string;

    @Column('timestamp', {
        name: 'initialTimestamp',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date | null;

    @ManyToOne(
        () => Collection,
        (omcollections) => omcollections.uploadSpeciesTmps,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'collid'}])
    collection: Promise<Collection>;
}
