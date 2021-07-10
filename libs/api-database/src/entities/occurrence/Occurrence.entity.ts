import {
    BeforeInsert,
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Collection } from '../collection';
import { Taxon } from '../taxonomy/Taxon.entity';
import { User } from '../user/User.entity';
import { EntityProvider } from '../../entity-provider.class';
import { ApiOccurrenceBasisOfRecord } from '@symbiota2/data-access';
import { v4 as uuid4 } from 'uuid';

@Entity()
@Index(['collectionID', 'dbpk'], { unique: true })
@Index(['sciname'])
@Index(['family'])
@Index(['country'])
@Index(['stateProvince'])
@Index(['county'])
@Index(['guid'], { unique: true })
@Index(['ownerInstitutionCode'])
@Index(['taxonID'])
@Index(['observerUID'])
@Index(['municipality'])
@Index(['recordNumber'])
@Index(['catalogNumber'])
@Index(['recordedByID'])
@Index(['recordedByNames'])
@Index(['eventDate'])
@Index(['processingStatus'])
@Index(['maximumElevationInMeters'])
@Index(['minimumElevationInMeters'])
@Index(['cultivationStatus'])
@Index(['typeStatus'])
@Index(['lastModifiedTimestamp'])
@Index(['initialTimestamp'])
@Index(['recordEnteredBy'])
@Index(['locality'])
@Index(['otherCatalogNumbers'])
@Index(['latestDateCollected'])
export class Occurrence extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'occid', unsigned: true })
    id: number;

    @Column('int', { unsigned: true })
    collectionID: number;

    // TODO: Better name
    @Column('varchar', { nullable: true, length: 150 })
    dbpk: string;

    @Column('varchar', {
        nullable: true,
        length: 32,
        default: ApiOccurrenceBasisOfRecord.PRESERVED_SPECIMEN,
    })
    basisOfRecord: ApiOccurrenceBasisOfRecord;

    @Column()
    guid: string;

    @Column('varchar', { nullable: true, length: 32 })
    catalogNumber: string;

    @Column('varchar', { nullable: true, length: 255 })
    otherCatalogNumbers: string;

    @Column('varchar', {
        nullable: true,
        length: 32,
    })
    ownerInstitutionCode: string;

    @Column('varchar', { nullable: true, length: 255 })
    institutionID: string;

    // TODO: What is this?
    @Column('varchar', { nullable: true, length: 255 })
    collectionIDStr: string;

    @Column('varchar', { nullable: true, length: 255 })
    datasetID: string;

    @Column('varchar', { nullable: true, length: 64 })
    institutionCode: string;

    @Column('varchar', { nullable: true, length: 64 })
    collectionCode: string;

    @Column('varchar', { nullable: true, length: 255 })
    family: string;

    // TODO: How can we name these to better distinguish between the two?
    @Column('varchar', { nullable: true, length: 255 })
    scientificName: string;

    @Column('varchar', { nullable: true, length: 255 })
    sciname: string;

    @Column('int', { nullable: true, unsigned: true })
    taxonID: number | null;

    @Column('varchar', { nullable: true, length: 255 })
    genus: string;

    @Column('varchar', { nullable: true, length: 255 })
    specificEpithet: string;

    @Column('varchar', { nullable: true, length: 32 })
    taxonRank: string;

    @Column('varchar', {
        nullable: true,
        length: 255,
    })
    infraspecificEpithet: string;

    @Column('varchar', {
        nullable: true,
        length: 255,
    })
    scientificNameAuthorship: string;

    @Column('text', { nullable: true })
    taxonRemarks: string;

    @Column('varchar', { nullable: true, length: 255 })
    identifiedBy: string;

    @Column('varchar', { nullable: true, length: 45 })
    dateIdentified: Date | null;

    @Column('text', { nullable: true })
    identificationReferences: string;

    @Column('text', { nullable: true })
    identificationRemarks: string;

    @Column('varchar', {
        nullable: true,
        comment: 'cf, aff, etc',
        length: 255,
    })
    identificationQualifier: string;

    @Column('varchar', { nullable: true, length: 255 })
    typeStatus: string;

    @Column('varchar', {
        nullable: true,
        comment: 'Collector(s)',
        length: 255,
    })
    recordedByNames: string;

    @Column('varchar', {
        nullable: true,
        comment: 'Collector Number',
        length: 45,
    })
    recordNumber: string;

    @Column('bigint', { nullable: true })
    recordedByID: string;

    @Column('varchar', {
        nullable: true,
        comment: 'not DwC',
        length: 255,
    })
    associatedCollectors: string;

    @Column('date', { nullable: true })
    eventDate: Date | null;

    @Column('date', { nullable: true })
    latestDateCollected: string;

    @Column('int', { nullable: true })
    year: number | null;

    @Column('int', { nullable: true })
    month: number | null;

    @Column('int', { nullable: true })
    day: number | null;

    @Column('int', { nullable: true })
    startDayOfYear: number | null;

    @Column('int', { nullable: true })
    endDayOfYear: number | null;

    @Column('varchar', {
        nullable: true,
        length: 255
    })
    verbatimEventDate: string;

    @Column('text', {
        nullable: true,
        comment: 'Habitat, substrate, etc',
    })
    habitat: string;

    @Column('varchar', { nullable: true, length: 500 })
    substrate: string;

    @Column('text', { nullable: true })
    fieldNotes: string;

    @Column('varchar', { nullable: true, length: 45 })
    fieldNumber: string;

    @Column('varchar', { nullable: true, length: 45 })
    eventID: string;

    @Column('text', {
        nullable: true,
        comment: 'General Notes',
    })
    occurrenceRemarks: string;

    @Column('varchar', {
        nullable: true,
        length: 250,
    })
    informationWithheld: string;

    @Column('varchar', {
        nullable: true,
        length: 250,
    })
    dataGeneralizations: string;

    @Column('text', { nullable: true })
    associatedOccurrences: string;

    @Column('text', {
        nullable: true,
        comment: 'Associated Species',
    })
    associatedTaxa: string;

    @Column('text', { nullable: true })
    dynamicProperties: string;

    @Column('text', { nullable: true })
    verbatimAttributes: string;

    @Column('varchar', { nullable: true, length: 500 })
    behavior: string;

    @Column('varchar', {
        nullable: true,
        comment: 'Phenology: flowers, fruit, sterile',
        length: 255,
    })
    reproductiveCondition: string;

    @Column('int', {
        nullable: true,
        comment: '0 = wild, 1 = cultivated',
    })
    cultivationStatus: number | null;

    @Column('varchar', {
        nullable: true,
        length: 150,
    })
    establishmentMeans: string;

    @Column('varchar', { nullable: true, length: 45 })
    lifeStage: string;

    @Column('varchar', { nullable: true, length: 45 })
    sex: string;

    @Column('varchar', { nullable: true, length: 45 })
    individualCount: string;

    @Column('varchar', {
        nullable: true,
        length: 100
    })
    samplingProtocol: string;

    @Column('varchar', { nullable: true, length: 200 })
    samplingEffort: string;

    @Column('varchar', { nullable: true, length: 100 })
    preparations: string;

    @Column('varchar', { nullable: true, length: 100 })
    locationID: string;

    @Column('varchar', { nullable: true, length: 64 })
    country: string;

    @Column('varchar', { nullable: true, length: 255 })
    stateProvince: string;

    @Column('varchar', { nullable: true, length: 255 })
    county: string;

    @Column('varchar', { nullable: true, length: 255 })
    municipality: string;

    @Column('varchar', { nullable: true, length: 255 })
    waterBody: string;

    @Column('text', { nullable: true })
    locality: string;

    @Column('int', {
        nullable: true,
        comment: '0 = no security; 1 = hidden locality',
        default: () => "'0'",
    })
    localitySecurity: number | null;

    @Column('varchar', {
        nullable: true,
        length: 100,
    })
    localitySecurityReason: string;

    @Column('double', { nullable: true })
    latitude: number | null;

    @Column('double', { nullable: true })
    longitude: number | null;

    @Column('varchar', { nullable: true, length: 255 })
    geodeticDatum: string;

    @Column('int', {
        nullable: true,
        unsigned: true,
    })
    coordinateUncertaintyInMeters: number | null;

    @Column('text', { nullable: true })
    footprintWKT: string;

    @Column('decimal', {
        nullable: true,
        precision: 9,
        scale: 7,
    })
    coordinatePrecision: number;

    @Column('text', { nullable: true })
    locationRemarks: string;

    @Column('varchar', {
        nullable: true,
        length: 255,
    })
    verbatimCoordinates: string;

    @Column('varchar', {
        nullable: true,
        length: 255,
    })
    verbatimCoordinateSystem: string;

    @Column('varchar', { nullable: true, length: 255 })
    georeferencedBy: string;

    @Column('varchar', {
        nullable: true,
        length: 255,
    })
    georeferenceProtocol: string;

    @Column('varchar', {
        nullable: true,
        length: 255,
    })
    georeferenceSources: string;

    @Column('varchar', {
        nullable: true,
        length: 32,
    })
    georeferenceVerificationStatus: string;

    @Column('varchar', {
        nullable: true,
        length: 255,
    })
    georeferenceRemarks: string;

    @Column('int', { nullable: true })
    minimumElevationInMeters: number | null;

    @Column('int', { nullable: true })
    maximumElevationInMeters: number | null;

    @Column('varchar', {
        nullable: true,
        length: 255
    })
    verbatimElevation: string;

    @Column('int', { nullable: true })
    minimumDepthInMeters: number | null;

    @Column('int', { nullable: true })
    maximumDepthInMeters: number | null;

    @Column('varchar', { nullable: true, length: 50 })
    verbatimDepth: string;

    @Column('text', { nullable: true })
    previousIdentifications: string;

    @Column('varchar', { nullable: true, length: 250 })
    disposition: string;

    @Column('varchar', { nullable: true, length: 100 })
    storageLocation: string;

    @Column('varchar', { nullable: true, length: 100 })
    genericColumn1: string;

    @Column('varchar', { nullable: true, length: 100 })
    genericColumn2: string;

    // TODO: Difference between this and DateLastModified?
    @Column('datetime', {
        nullable: true,
        comment: 'DateLastModified',
    })
    modified: Date | null;

    @Column('varchar', { nullable: true, length: 20 })
    language: string;

    @Column('int', { nullable: true, unsigned: true })
    observerUID: number | null;

    @Column('varchar', { nullable: true, length: 45 })
    processingStatus: string;

    @Column('varchar', { nullable: true, length: 250 })
    recordEnteredBy: string;

    @Column('int', {
        nullable: true,
        unsigned: true
    })
    duplicateQuantity: number | null;

    @Column('varchar', { nullable: true, length: 50 })
    labelProject: string;

    @Column('text', { nullable: true })
    dynamicFields: string;

    @Column('datetime', { nullable: true, default: () => 'CURRENT_TIMESTAMP()' })
    initialTimestamp: Date | null;

    @Column('timestamp', {
        default: () => 'CURRENT_TIMESTAMP()',
    })
    lastModifiedTimestamp: Date;

    @ManyToOne(
        () => Collection,
        (omcollections) => omcollections.occurrences,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn({ name: 'collectionID' })
    collection: Promise<Collection>;

    @ManyToOne(() => Taxon, (taxa) => taxa.occurrences, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'taxonID'})
    taxon: Promise<Taxon>;

    @ManyToOne(() => User, (users) => users.observedOccurrences, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn({ name: 'observerUID' })
    observer: Promise<User>;

    @BeforeInsert()
    setGUID() {
        if (this.guid === null || this.guid === '') {
            this.guid = uuid4();
        }
    }
}
