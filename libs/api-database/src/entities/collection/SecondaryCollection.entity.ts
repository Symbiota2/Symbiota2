import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Collection } from './Collection.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['primaryCollectionID'])
@Entity('omcollsecondary')
export class SecondaryCollection extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'ocsid', unsigned: true })
    id: number;

    @Column('int', { name: 'collid', unsigned: true })
    primaryCollectionID: number;

    @Column('varchar', { name: 'InstitutionCode', length: 45 })
    institutionCode: string;

    @Column('varchar', { name: 'CollectionCode', nullable: true, length: 45 })
    collectionCode: string | null;

    @Column('varchar', { name: 'CollectionName', length: 150 })
    collectionName: string;

    @Column('varchar', {
        name: 'BriefDescription',
        nullable: true,
        length: 300
    })
    briefDescription: string | null;

    @Column('varchar', {
        name: 'FullDescription',
        nullable: true,
        length: 1000
    })
    fullDescription: string | null;

    @Column('varchar', { name: 'Homepage', nullable: true, length: 250 })
    homePage: string | null;

    @Column('varchar', { name: 'IndividualUrl', nullable: true, length: 500 })
    individualUrl: string | null;

    @Column('varchar', { name: 'Contact', nullable: true, length: 45 })
    contact: string | null;

    @Column('varchar', { name: 'Email', nullable: true, length: 45 })
    email: string | null;

    @Column('double', {
        name: 'LatitudeDecimal',
        nullable: true,
        precision: 22
    })
    latitude: number | null;

    @Column('double', {
        name: 'LongitudeDecimal',
        nullable: true,
        precision: 22
    })
    longitude: number | null;

    @Column('varchar', { name: 'icon', nullable: true, length: 250 })
    icon: string | null;

    @Column('varchar', { name: 'CollType', nullable: true, length: 45 })
    type: string | null;

    @Column('int', { name: 'SortSeq', nullable: true, unsigned: true })
    sortSequence: number | null;

    @Column('timestamp', {
        name: 'InitialTimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => Collection,
        (omcollections) => omcollections.collectionSecondaries,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'collid'}])
    primaryCollection: Promise<Collection>;
}
