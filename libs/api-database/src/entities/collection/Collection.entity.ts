import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { AdminStat } from '../AdminStat.entity';
import { CollectionStat } from './CollectionStat.entity';
import { CollectionCategoryLink } from './CollectionCategoryLink.entity';
import { Institution } from './Institution.entity';
import { CrowdSourceCentral } from '../crowd-source/CrowdSourceCentral.entity';
import { ReferenceCollectionLink } from '../reference/ReferenceCollectionLink.entity';
import { SpeciesProcessorProject } from '../species-processor/SpeciesProcessorProject.entity';
import { SpeciesUploadTemp } from '../upload/SpeciesUploadTemp.entity';
import { CollectionContact } from './CollectionContact.entity';
import { OccurrenceLoan } from '../occurrence/OccurrenceLoan.entity';
import { SecondaryCollection } from './SecondaryCollection.entity';
import { CollectionPublication } from './CollectionPublication.entity';
import { SpeciesUploadParameter } from '../upload/SpeciesUploadParameter.entity';
import { OccurrenceDataset } from '../occurrence/OccurrenceDataset.entity';
import { SpeciesProcessorNLP } from '../species-processor/SpeciesProcessorNLP.entity';
import { Occurrence } from '../occurrence/Occurrence.entity';
import { OccurrenceExchange } from '../occurrence/OccurrenceExchange.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index('Index_inst', ['institutionCode', 'collectionCode'], { unique: true })
@Index(['institutionID'])
@Entity('omcollections')
export class Collection extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'CollID', unsigned: true })
    id: number;

    @Column('varchar', { name: 'InstitutionCode', length: 45 })
    institutionCode: string = ""

    @Column('varchar', { name: 'CollectionCode', nullable: true, length: 45 })
    collectionCode: string;

    @Column('varchar', { name: 'CollectionName', length: 150 })
    collectionName: string;

    @Column('varchar', { name: 'collectionId', nullable: true, length: 100 })
    collectionIDStr: string;

    @Column('varchar', { name: 'datasetName', nullable: true, length: 100 })
    datasetName: string;

    @Column('int', { name: 'iid', nullable: true, unsigned: true })
    institutionID: number | null;

    @Column('varchar', {
        name: 'fulldescription',
        nullable: true,
        length: 2000
    })
    fullDescription: string;

    @Column('varchar', { name: 'Homepage', nullable: true, length: 250 })
    homePage: string;

    @Column('varchar', { name: 'IndividualUrl', nullable: true, length: 500 })
    individualUrl: string;

    @Column('varchar', { name: 'Contact', nullable: true, length: 250 })
    contact: string;

    @Column('varchar', { name: 'email', nullable: true, length: 45 })
    email: string;

    @Column('decimal', {
        name: 'latitudedecimal',
        nullable: true,
        precision: 8,
        scale: 6,
    })
    latitude: number;

    @Column('decimal', {
        name: 'longitudedecimal',
        nullable: true,
        precision: 9,
        scale: 6,
    })
    longitude: number;

    @Column('varchar', { name: 'icon', nullable: true, length: 250 })
    icon: string;

    @Column('varchar', {
        name: 'CollType',
        comment: 'Preserved Specimens, General Observations, Observations',
        length: 45,
        default: () => '\'Preserved Specimens\'',
    })
    type: string;

    @Column('varchar', {
        name: 'ManagementType',
        nullable: true,
        comment: 'Snapshot, Live Data',
        length: 45,
        default: () => '\'Snapshot\'',
    })
    managementType: string;

    @Column('int', {
        name: 'PublicEdits',
        unsigned: true,
        default: () => '\'1\''
    })
    publicEdits: number;

    @Column('varchar', { name: 'collectionguid', nullable: true, length: 45 })
    collectionGUID: string;

    @Column('varchar', { name: 'securitykey', nullable: true, length: 45 })
    securityKey: string;

    @Column('varchar', { name: 'guidtarget', nullable: true, length: 45 })
    guidTarget: string;

    @Column('varchar', { name: 'rightsHolder', nullable: true, length: 250 })
    rightsHolder: string;

    @Column('varchar', { name: 'rights', nullable: true, length: 250 })
    rights: string;

    @Column('varchar', { name: 'usageTerm', nullable: true, length: 250 })
    usageTerm: string;

    @Column('int', { name: 'publishToGbif', nullable: true })
    publishToGBIF: number | null;

    @Column('int', { name: 'publishToIdigbio', nullable: true })
    publishToIDigBio: number | null;

    // TODO: Better name
    @Column('varchar', { name: 'aggKeysStr', nullable: true, length: 1000 })
    aggKeysStr: string;

    @Column('varchar', { name: 'dwcaUrl', nullable: true, length: 250 })
    dwcaUrl: string;

    @Column('varchar', {
        name: 'bibliographicCitation',
        nullable: true,
        length: 1000,
    })
    bibliographicCitation: string;

    @Column('varchar', { name: 'accessrights', nullable: true, length: 1000 })
    accessRights: string;

    @Column('int', { name: 'SortSeq', nullable: true, unsigned: true })
    sortSequence: number | null;

    @Column('timestamp', {
        name: 'InitialTimeStamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToMany(() => AdminStat, (adminstats) => adminstats.collection)
    adminStats: Promise<AdminStat[]>;

    @OneToOne(
        () => CollectionStat,
        (omcollectionstats) => omcollectionstats.collection
    )
    collectionStats: Promise<CollectionStat>;

    @OneToMany(() => CollectionCategoryLink, (omcollcatlink) => omcollcatlink.collection)
    collectionCategoryLinks: Promise<CollectionCategoryLink[]>;

    @ManyToOne(() => Institution, (institutions) => institutions.collections, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'iid'}])
    institution: Promise<Institution>;

    @OneToOne(
        () => CrowdSourceCentral,
        (omcrowdsourcecentral) => omcrowdsourcecentral.collection
    )
    crowdSourceCentral: Promise<CrowdSourceCentral>;

    @OneToMany(
        () => ReferenceCollectionLink,
        (referencecollectionlink) => referencecollectionlink.collection
    )
    referenceCollectionLinks: Promise<ReferenceCollectionLink[]>;

    @OneToMany(
        () => SpeciesProcessorProject,
        (specprocessorprojects) => specprocessorprojects.collection
    )
    specimenProcessorProjects: Promise<SpeciesProcessorProject[]>;

    @OneToMany(() => SpeciesUploadTemp, (uploadspectemp) => uploadspectemp.collection)
    uploadSpeciesTmps: SpeciesUploadTemp[];

    @OneToMany(
        () => CollectionContact,
        (omcollectioncontacts) => omcollectioncontacts.collection
    )
    collectionContacts: Promise<CollectionContact[]>;

    @OneToMany(() => OccurrenceLoan, (omoccurloans) => omoccurloans.borrowerCollection)
    occurrenceLoanBorrowers: Promise<OccurrenceLoan[]>;

    @OneToMany(() => OccurrenceLoan, (omoccurloans) => omoccurloans.ownerCollection)
    occurrenceLoanLenders: Promise<OccurrenceLoan[]>;

    @OneToMany(() => SecondaryCollection, (omcollsecondary) => omcollsecondary.primaryCollection)
    collectionSecondaries: Promise<SecondaryCollection[]>;

    @OneToMany(
        () => CollectionPublication,
        (omcollpublications) => omcollpublications.collection
    )
    collectionPublications: Promise<CollectionPublication[]>;

    @OneToMany(
        () => SpeciesUploadParameter,
        (uploadspecparameters) => uploadspecparameters.collection
    )
    speciesUploadParameters: Promise<SpeciesUploadParameter[]>;

    @OneToMany(() => OccurrenceDataset, (omoccurdatasets) => omoccurdatasets.collection)
    datasets: Promise<OccurrenceDataset[]>;

    // TODO: Better name
    @OneToMany(() => SpeciesProcessorNLP, (specprocnlp) => specprocnlp.collection)
    specprocnlps: Promise<SpeciesProcessorNLP[]>;

    @OneToMany(() => Occurrence, (omoccurrences) => omoccurrences.collection)
    occurrences: Promise<Occurrence[]>;

    @OneToMany(() => OccurrenceExchange, (omoccurexchange) => omoccurexchange.collection)
    occurrenceExchanges: Promise<OccurrenceExchange[]>;
}
