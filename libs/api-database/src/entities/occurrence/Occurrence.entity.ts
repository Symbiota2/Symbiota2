import {
    BeforeInsert, BeforeUpdate,
    Column, DeepPartial,
    Entity, getConnection,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn, Repository
} from 'typeorm';
import { OccurrenceVerification } from './OccurrenceVerification.entity';
import { OccurrenceLithostratigraphy } from './OccurrenceLithostratigraphy.entity';
import { TraitAttribute } from '../trait/TraitAttribute.entity';
import { OccurrenceLoanLink } from './OccurrenceLoanLink.entity';
import { Medium } from '../Medium.entity';
import { OccurrenceDetermination } from './OccurrenceDetermination.entity';
import { OccurrenceEdit } from './OccurrenceEdit.entity';
import { ExsiccatiOccurrenceLink } from '../exsiccati';
import { Image } from '../image/Image.entity';
import { OccurrenceAccessStat } from './OccurrenceAccessStat.entity';
import { OccurrenceRevision } from './OccurrenceRevision.entity';
import { OccurrenceType } from './OccurrenceType.entity';
import { OccurrenceGenetic } from './OccurrenceGenetic.entity';
import { OccurrenceIdentifier } from './OccurrenceIdentifier.entity';
import { SpeciesProcessorRawLabel } from '../species-processor/SpeciesProcessorRawLabel.entity';
import { CollectionPublicationOccurrenceLink } from '../collection';
import { OccurrenceComment } from './OccurrenceComment.entity';
import { OccurrenceDuplicateLink } from './OccurrenceDuplicateLink.entity';
import { CrowdSourceQueue } from '../crowd-source';
import { Voucher } from '../Voucher.entity';
import { OccurrenceAssociation } from './OccurrenceAssociation.entity';
import { ReferenceOccurrenceLink } from '../reference';
import { Collection } from '../collection';
import { Agent } from '../agent';
import { Taxon } from '../taxonomy/Taxon.entity';
import { User } from '../user/User.entity';
import { OccurrenceDatasetLink } from './OccurrenceDatasetLink.entity';
import { EntityProvider } from '../../entity-provider.class';
import { v4 as uuid4 } from 'uuid';
import {
    DwCID,
    dwcField,
    DwCField,
    DwCRecord
} from '@symbiota2/dwc';

// http://dwc.tdwg.org/terms/#occurrence

@DwCRecord('http://rs.tdwg.org/dwc/terms/Occurrence')
@Index('Index_collid', ['collectionID', 'dbpk'], { unique: true })
@Index(['scientificName'])
@Index('Index_family', ['family'])
@Index('Index_country', ['country'])
@Index('Index_state', ['stateProvince'])
@Index('Index_county', ['county'])
@Index('Index_gui', ['occurrenceGUID'])
@Index('Index_ownerInst', ['ownerInstitutionCode'])
@Index(['taxonID'])
@Index(['observerUID'])
@Index('Index_municipality', ['municipality'])
@Index('Index_collnum', ['recordNumber'])
@Index('Index_catalognumber', ['catalogNumber'])
@Index(['recordedByID'])
@Index('Index_collector', ['recordedByNames'])
@Index('idx_occrecordedby', ['recordedByNames'])
@Index('Index_eventDate', ['eventDate'])
@Index('Index_occurrences_procstatus', ['processingStatus'])
@Index('occelevmax', ['maximumElevationInMeters'])
@Index('occelevmin', ['minimumElevationInMeters'])
@Index('Index_occurrences_cult', ['cultivationStatus'])
@Index('Index_occurrences_typestatus', ['typeStatus'])
@Index('Index_occurDateLastModifed', ['lastModifiedTimestamp'])
@Index('Index_occurDateEntered', ['initialTimestamp'])
@Index('Index_occurRecordEnteredBy', ['recordEnteredBy'])
@Index('Index_locality', ['locality'])
@Index('Index_otherCatalogNumbers', ['otherCatalogNumbers'])
@Index('Index_latestDateCollected', ['latestDateCollected'])
@Entity('omoccurrences')
export class Occurrence extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'occid', unsigned: true })
    id: number;

    @Column('int', { name: 'collid', unsigned: true })
    collectionID: number;

    // TODO: Better name
    @Column('varchar', { name: 'dbpk', nullable: true, length: 150 })
    dbpk: string;

    @DwCField('http://rs.tdwg.org/dwc/terms/basisOfRecord')
    @Column('varchar', {
        name: 'basisOfRecord',
        nullable: true,
        comment: 'PreservedSpecimen, LivingSpecimen, HumanObservation',
        length: 32,
        default: () => '\'PreservedSpecimen\'',
    })
    basisOfRecord: string;

    @DwCID()
    @DwCField('http://rs.tdwg.org/dwc/terms/occurrenceID')
    @Column('varchar', {
        name: 'occurrenceID',
        nullable: true,
        comment: 'UniqueGlobalIdentifier',
        length: 255,
    })
    occurrenceGUID: string;

    @BeforeInsert()
    @BeforeUpdate()
    private setGUIDIfNotExists() {
        if (!this.occurrenceGUID) {
            this.occurrenceGUID = uuid4();
        }
    }

    @DwCField('http://rs.tdwg.org/dwc/terms/catalogNumber')
    @Column('varchar', { name: 'catalogNumber', nullable: true, length: 32 })
    catalogNumber: string;

    @DwCField('http://rs.tdwg.org/dwc/terms/otherCatalogNumbers')
    @Column('varchar', {
        name: 'otherCatalogNumbers',
        nullable: true,
        length: 255,
    })
    otherCatalogNumbers: string;

    @DwCField('http://rs.tdwg.org/dwc/terms/ownerInstitutionCode')
    @Column('varchar', {
        name: 'ownerInstitutionCode',
        nullable: true,
        length: 32,
    })
    ownerInstitutionCode: string;

    @DwCField('http://rs.tdwg.org/dwc/terms/datasetID')
    @Column('varchar', { name: 'datasetID', nullable: true, length: 255 })
    datasetID: string;

    @Column('varchar', { name: 'family', nullable: true, length: 255 })
    family: string;

    @Column('varchar', { name: 'scientificName', nullable: true, length: 255 })
    scientificName: string;

    @DwCField('http://rs.tdwg.org/dwc/terms/taxonID')
    @Column('int', { name: 'tidinterpreted', nullable: true, unsigned: true })
    taxonID: number | null;

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

    @Column('text', { name: 'taxonRemarks', nullable: true })
    taxonRemarks: string;

    @Column('varchar', { name: 'identifiedBy', nullable: true, length: 255 })
    identifiedBy: string;

    @Column('varchar', { name: 'dateIdentified', nullable: true, length: 45 })
    dateIdentified: Date | null;

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

    @DwCField('http://rs.tdwg.org/dwc/terms/recordedBy')
    @Column('varchar', {
        name: 'recordedBy',
        nullable: true,
        comment: 'Collector(s)',
        length: 255,
    })
    recordedByNames: string;

    @DwCField('http://rs.tdwg.org/dwc/terms/recordNumber')
    @Column('varchar', {
        name: 'recordNumber',
        nullable: true,
        comment: 'Collector Number',
        length: 45,
    })
    recordNumber: string;

    @Column('bigint', { name: 'recordedbyid', nullable: true })
    recordedByID: string;

    @Column('varchar', {
        name: 'associatedCollectors',
        nullable: true,
        comment: 'not DwC',
        length: 255,
    })
    associatedCollectors: string;

    @Column('date', { name: 'eventDate', nullable: true })
    eventDate: Date | null;

    @Column('date', { name: 'latestDateCollected', nullable: true })
    latestDateCollected: string;

    get year(): number {
        return this.eventDate.getUTCFullYear();
    }

    get month(): number {
        return this.eventDate.getUTCMonth();
    }

    get day(): number {
        return this.eventDate.getUTCDate();
    }

    @Column('int', { name: 'startDayOfYear', nullable: true })
    startDayOfYear: number | null;

    @Column('int', { name: 'endDayOfYear', nullable: true })
    endDayOfYear: number | null;

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

    @Column('text', { name: 'fieldNotes', nullable: true })
    fieldNotes: string;

    @Column('varchar', { name: 'fieldnumber', nullable: true, length: 45 })
    fieldNumber: string;

    @Column('varchar', { name: 'eventID', nullable: true, length: 45 })
    eventID: string;

    @Column('text', {
        name: 'occurrenceRemarks',
        nullable: true,
        comment: 'General Notes',
    })
    occurrenceRemarks: string;

    @DwCField('http://rs.tdwg.org/dwc/terms/informationWithheld')
    @Column('varchar', {
        name: 'informationWithheld',
        nullable: true,
        length: 500,
    })
    informationWithheld: string;

    @DwCField('http://rs.tdwg.org/dwc/terms/dataGeneralizations')
    @Column('varchar', {
        name: 'dataGeneralizations',
        nullable: true,
        length: 250,
    })
    dataGeneralizations: string;

    @DwCField('http://rs.tdwg.org/dwc/terms/associatedOccurrences')
    @Column('text', { name: 'associatedOccurrences', nullable: true })
    associatedOccurrences: string;

    @DwCField('http://rs.tdwg.org/dwc/terms/associatedTaxa')
    @Column('text', {
        name: 'associatedTaxa',
        nullable: true,
        comment: 'Associated Species',
    })
    associatedTaxa: string;

    @DwCField('http://rs.tdwg.org/dwc/terms/dynamicProperties')
    @Column('text', { name: 'dynamicProperties', nullable: true })
    dynamicProperties: string;

    @Column('text', { name: 'verbatimAttributes', nullable: true })
    verbatimAttributes: string;

    @DwCField('http://rs.tdwg.org/dwc/terms/behavior')
    @Column('varchar', { name: 'behavior', nullable: true, length: 500 })
    behavior: string;

    @DwCField('http://rs.tdwg.org/dwc/terms/reproductiveCondition')
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

    @DwCField('http://rs.tdwg.org/dwc/terms/establishmentMeans')
    @Column('varchar', {
        name: 'establishmentMeans',
        nullable: true,
        length: 150,
    })
    establishmentMeans: string;

    @DwCField('http://rs.tdwg.org/dwc/terms/lifeStage')
    @Column('varchar', { name: 'lifeStage', nullable: true, length: 45 })
    lifeStage: string;

    @DwCField('http://rs.tdwg.org/dwc/terms/sex')
    @Column('varchar', { name: 'sex', nullable: true, length: 45 })
    sex: string;

    @DwCField('http://rs.tdwg.org/dwc/terms/individualCount')
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

    @DwCField('http://rs.tdwg.org/dwc/terms/preparations')
    @Column('varchar', { name: 'preparations', nullable: true, length: 100 })
    preparations: string;

    @Column('varchar', { name: 'locationID', nullable: true, length: 100 })
    locationID: string;

    @Column('varchar', { name: 'country', nullable: true, length: 64 })
    country: string;

    @Column('varchar', { name: 'stateProvince', nullable: true, length: 255 })
    stateProvince: string;

    @Column('varchar', { name: 'county', nullable: true, length: 255 })
    county: string;

    @Column('varchar', { name: 'municipality', nullable: true, length: 255 })
    municipality: string;

    @Column('varchar', { name: 'waterBody', nullable: true, length: 255 })
    waterBody: string;

    @Column('text', { name: 'locality', nullable: true })
    locality: string;

    @Column('int', {
        name: 'localitySecurity',
        nullable: true,
        comment: '0 = no security; 1 = hidden locality',
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
    coordinatePrecision: number;

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

    @DwCField('http://rs.tdwg.org/dwc/terms/georeferenceVerificationStatus')
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

    @DwCField('http://rs.tdwg.org/dwc/terms/disposition')
    @Column('varchar', { name: 'disposition', nullable: true, length: 250 })
    disposition: string;

    @Column('varchar', { name: 'storageLocation', nullable: true, length: 100 })
    storageLocation: string;

    @Column('varchar', { name: 'genericcolumn1', nullable: true, length: 100 })
    genericColumn1: string;

    @Column('varchar', { name: 'genericcolumn2', nullable: true, length: 100 })
    genericColumn2: string;

    // TODO: Difference between this and DateLastModified?
    @Column('datetime', {
        name: 'modified',
        nullable: true,
        comment: 'DateLastModified',
    })
    modified: Date | null;

    @DwCField('http://purl.org/dc/elements/1.1/language')
    @Column('varchar', { name: 'language', nullable: true, length: 20 })
    language: string;

    @Column('int', { name: 'observeruid', nullable: true, unsigned: true })
    observerUID: number | null;

    @Column('varchar', { name: 'processingstatus', nullable: true, length: 45 })
    processingStatus: string;

    @Column('varchar', { name: 'recordEnteredBy', nullable: true, length: 250 })
    recordEnteredBy: string;

    @Column('int', {
        name: 'duplicateQuantity',
        nullable: true,
        unsigned: true
    })
    duplicateQuantity: number | null;

    @Column('varchar', { name: 'labelProject', nullable: true, length: 50 })
    labelProject: string;

    @Column('text', { name: 'dynamicFields', nullable: true })
    dynamicFields: string;

    @Column('datetime', { name: 'dateEntered', nullable: true })
    initialTimestamp: Date | null;

    @DwCField('http://purl.org/dc/terms/modified')
    @Column('timestamp', {
        name: 'dateLastModified',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    lastModifiedTimestamp: Date;

    @OneToMany(
        () => OccurrenceVerification,
        (omoccurverification) => omoccurverification.occurrence
    )
    verifications: Promise<OccurrenceVerification[]>;

    @OneToMany(
        () => OccurrenceLithostratigraphy,
        (omoccurlithostratigraphy) => omoccurlithostratigraphy.occurrence
    )
    lithostratigraphies: Promise<OccurrenceLithostratigraphy[]>;

    // TODO: What's this?
    @OneToMany(() => TraitAttribute, (tmattributes) => tmattributes.occurrence)
    tmattributes: Promise<TraitAttribute[]>;

    @OneToMany(() => OccurrenceLoanLink, (omoccurloanslink) => omoccurloanslink.occurrence)
    loanLinks: Promise<OccurrenceLoanLink[]>;

    @OneToMany(() => Medium, (media) => media.occurrence)
    media: Promise<Medium[]>;

    @OneToMany(
        () => OccurrenceDetermination,
        (omoccurdeterminations) => omoccurdeterminations.occurrence
    )
    determinations: Promise<OccurrenceDetermination[]>;

    @OneToMany(() => OccurrenceEdit, (omoccuredits) => omoccuredits.occurrence)
    edits: Promise<OccurrenceEdit[]>;

    @OneToOne(
        () => ExsiccatiOccurrenceLink,
        (omexsiccatiocclink) => omexsiccatiocclink.occurrence
    )
    exsiccatiLinks: Promise<ExsiccatiOccurrenceLink>;

    @OneToMany(() => Image, (images) => images.occurrence)
    images: Promise<Image[]>;

    @OneToMany(
        () => OccurrenceAccessStat,
        (omoccuraccessstats) => omoccuraccessstats.occurrence
    )
    accessStats: Promise<OccurrenceAccessStat[]>;

    @OneToMany(() => OccurrenceRevision, (omoccurrevisions) => omoccurrevisions.occurrence)
    revisions: Promise<OccurrenceRevision[]>;

    @OneToMany(
        () => OccurrenceType,
        (omoccurrencetypes) => omoccurrencetypes.occurrence
    )
    occurrenceTypes: Promise<OccurrenceType[]>;

    @OneToMany(() => OccurrenceGenetic, (omoccurgenetic) => omoccurgenetic.occurrence)
    genetics: Promise<OccurrenceGenetic[]>;

    @OneToMany(
        () => OccurrenceIdentifier,
        (omoccuridentifiers) => omoccuridentifiers.occurrence
    )
    identifiers: Promise<OccurrenceIdentifier[]>;

    @OneToMany(
        () => SpeciesProcessorRawLabel,
        (specprocessorrawlabels) => specprocessorrawlabels.occurrence
    )
    processorRawLabels: Promise<SpeciesProcessorRawLabel[]>;

    @OneToMany(
        () => CollectionPublicationOccurrenceLink,
        (omcollpuboccurlink) => omcollpuboccurlink.occurrence
    )
    publicationLinks: Promise<CollectionPublicationOccurrenceLink[]>;

    @OneToMany(() => OccurrenceComment, (omoccurcomments) => omoccurcomments.occurrence)
    comments: Promise<OccurrenceComment[]>;

    @OneToMany(
        () => OccurrenceDuplicateLink,
        (omoccurduplicatelink) => omoccurduplicatelink.occurrence
    )
    duplicateLinks: Promise<OccurrenceDuplicateLink[]>;

    @OneToOne(
        () => CrowdSourceQueue,
        (omcrowdsourcequeue) => omcrowdsourcequeue.occurrence
    )
    crowdSourceQueue: Promise<CrowdSourceQueue>;

    @OneToMany(() => Voucher, (fmvouchers) => fmvouchers.occurrence)
    fmvouchers: Promise<Voucher[]>;

    @OneToMany(
        () => OccurrenceAssociation,
        (omoccurassociations) => omoccurassociations.occurrence
    )
    associations: Promise<OccurrenceAssociation[]>;

    @OneToMany(
        () => OccurrenceAssociation,
        (omoccurassociations) => omoccurassociations.associatedOccurrence
    )
    associatedWith: Promise<OccurrenceAssociation[]>;

    @OneToMany(
        () => ReferenceOccurrenceLink,
        (referenceoccurlink) => referenceoccurlink.occurrence
    )
    referenceLinks: Promise<ReferenceOccurrenceLink[]>;

    @ManyToOne(
        () => Collection,
        (omcollections) => omcollections.occurrences,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'collid'}])
    collection: Promise<Collection>;

    @ManyToOne(() => Agent, (agents) => agents.occurrences, {
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'recordedbyid'}])
    recordedBy: Promise<Agent>;

    @ManyToOne(() => Taxon, (taxa) => taxa.occurrences, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'tidinterpreted'}])
    taxon: Promise<Taxon>;

    @ManyToOne(() => User, (users) => users.observedOccurrences, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn([{ name: 'observeruid', referencedColumnName: 'uid' }])
    observer: Promise<User>;

    @OneToMany(
        () => OccurrenceDatasetLink,
        (omoccurdatasetlink) => omoccurdatasetlink.occurrence
    )
    datasetLinks: Promise<OccurrenceDatasetLink[]>;

    @BeforeInsert()
    async clearTaxonomy() {
        // The only way these should be set is through populateTaxonomy()
        this.taxonID = null;
        this.family = null;
        this.genus = null;
    }

    @BeforeUpdate()
    async updateLastModified() {
        this.lastModifiedTimestamp = new Date();
    }

    async populateTaxonomy(
        taxonRepo: Repository<Taxon>,
        familyRankID: number,
        genusRankID: number) {

        // It's already populated
        if (this.taxonID && this.family && this.genus) {
            return;
        }

        if (!this.scientificName) {
            this.taxonID = null;
            this.family = null;
            this.genus = null;
            return;
        }

        let taxon: Taxon;
        if (!this.taxonID) {
            taxon = await taxonRepo.findOne(
                { scientificName: this.scientificName },
                { select: ['id', 'author'] }
            );

            if (!taxon) {
                this.family = null;
                this.genus = null;
                return;
            }

            this.taxonID = taxon.id;
        }
        else {
            taxon = await this.taxon;
        }

        if (!(this.family || this.genus)) {
            const family = await taxon.lookupAncestor(
                taxonRepo,
                familyRankID
            );
            const genus = await taxon.lookupAncestor(
                taxonRepo,
                genusRankID
            );

            this.genus = genus ? genus.scientificName : null;
            this.family = family ? family.scientificName : null;
        }
    }
}
