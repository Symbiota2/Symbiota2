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
import { CollectionStat } from './CollectionStat.entity';
import { CollectionCategoryLink } from './CollectionCategoryLink.entity';
import { Institution } from './Institution.entity';
import { Occurrence } from '../occurrence/Occurrence.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['institutionCode', 'collectionCode'], { unique: true })
@Index(['institutionID'])
@Entity()
export class Collection extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column('varchar', {  length: 45 })
    institutionCode: string;

    @Column('varchar', {  nullable: true, length: 45 })
    collectionCode: string;

    @Column('varchar', {  length: 150 })
    collectionName: string;

    @Column('varchar', {  nullable: true, length: 100 })
    collectionIDStr: string;

    @Column('varchar', {  nullable: true, length: 100 })
    datasetName: string;

    @Column('int', {  nullable: true, unsigned: true })
    institutionID: number | null;

    @Column('varchar', {

        nullable: true,
        length: 2000
    })
    fullDescription: string;

    @Column('varchar', {  nullable: true, length: 250 })
    homePage: string;

    @Column('varchar', {  nullable: true, length: 500 })
    individualUrl: string;

    @Column('varchar', {  nullable: true, length: 250 })
    contact: string;

    @Column('varchar', {  nullable: true, length: 45 })
    email: string;

    @Column('decimal', {
        nullable: true,
        precision: 8,
        scale: 6,
    })
    latitude: number;

    @Column('decimal', {
        nullable: true,
        precision: 9,
        scale: 6,
    })
    longitude: number;

    @Column('varchar', {  nullable: true, length: 250 })
    icon: string;

    @Column('varchar', {

        comment: 'Preserved Specimens, General Observations, Observations',
        length: 45,
        default: () => '\'Preserved Specimens\'',
    })
    type: string;

    @Column('varchar', {

        nullable: true,
        comment: 'Snapshot, Live Data',
        length: 45,
        default: () => '\'Snapshot\'',
    })
    managementType: string;

    @Column('int', {

        unsigned: true,
        default: () => '\'1\''
    })
    publicEdits: number;

    @Column('varchar', {  nullable: true, length: 45 })
    collectionGUID: string;

    @Column('varchar', {  nullable: true, length: 45 })
    securityKey: string;

    @Column('varchar', {  nullable: true, length: 45 })
    guidTarget: string;

    @Column('varchar', {  nullable: true, length: 250 })
    rightsHolder: string;

    @Column('varchar', {  nullable: true, length: 250 })
    rights: string;

    @Column('varchar', {  nullable: true, length: 250 })
    usageTerm: string;

    @Column('int', {  nullable: true })
    publishToGBIF: number | null;

    @Column('int', {  nullable: true })
    publishToIDigBio: number | null;

    // TODO: Better name
    @Column('varchar', {  nullable: true, length: 1000 })
    aggKeysStr: string;

    @Column('varchar', {  nullable: true, length: 250 })
    dwcaUrl: string;

    @Column('varchar', {

        nullable: true,
        length: 1000,
    })
    bibliographicCitation: string;

    @Column('varchar', {  nullable: true, length: 1000 })
    accessRights: string;

    @Column('int', {  nullable: true, unsigned: true })
    sortSequence: number | null;

    @Column('timestamp', {
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToOne(
        () => CollectionStat,
        (omcollectionstats) => omcollectionstats.collection
    )
    collectionStats: Promise<CollectionStat>;

    @OneToMany(() => CollectionCategoryLink, (omcollcatlink) => omcollcatlink.collection)
    categoryLinks: Promise<CollectionCategoryLink[]>;

    @ManyToOne(() => Institution, (institutions) => institutions.collections, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'institutionID' }])
    institution: Promise<Institution>;

    @OneToMany(() => Occurrence, (omoccurrences) => omoccurrences.collection)
    occurrences: Promise<Occurrence[]>;
}
