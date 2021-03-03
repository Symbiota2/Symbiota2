import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Occurrence } from './Occurrence.entity';
import { Taxon } from '../taxonomy/Taxon.entity';
import { User } from '../user/User.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index('omossococcur_occid_idx', ['occurrenceID'])
@Index('omossococcur_occidassoc_idx', ['associatedOccurrenceID'])
@Index(['taxonID'])
@Index(['lastModifiedUID'])
@Index(['creatorUID'])
@Index('INDEX_verbatimSciname', ['verbatimSciName'])
@Entity('omoccurassociations')
export class OccurrenceAssociation extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'associd', unsigned: true })
    id: number;

    @Column('int', { name: 'occid', unsigned: true })
    occurrenceID: number;

    @Column('int', { name: 'occidassociate', nullable: true, unsigned: true })
    associatedOccurrenceID: number | null;

    @Column('varchar', { name: 'relationship', length: 150 })
    relationship: string;

    @Column('varchar', {
        name: 'identifier',
        nullable: true,
        comment: 'e.g. GUID',
        length: 250,
    })
    identifier: string | null;

    @Column('varchar', { name: 'basisOfRecord', nullable: true, length: 45 })
    basisOfRecord: string | null;

    @Column('varchar', { name: 'resourceurl', nullable: true, length: 250 })
    resourceUrl: string | null;

    @Column('varchar', { name: 'verbatimsciname', nullable: true, length: 250 })
    verbatimSciName: string | null;

    @Column('int', { name: 'tid', nullable: true, unsigned: true })
    taxonID: number | null;

    @Column('varchar', { name: 'locationOnHost', nullable: true, length: 250 })
    locationOnHost: string | null;

    @Column('varchar', { name: 'condition', nullable: true, length: 250 })
    condition: string | null;

    @Column('datetime', { name: 'dateEmerged', nullable: true })
    dateEmerged: Date | null;

    @Column('text', { name: 'dynamicProperties', nullable: true })
    dynamicProperties: string | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string | null;

    @Column('int', { name: 'createduid', nullable: true, unsigned: true })
    creatorUID: number | null;

    @Column('datetime', { name: 'datelastmodified', nullable: true })
    lastModifiedTimestamp: Date | null;

    @Column('int', { name: 'modifieduid', nullable: true, unsigned: true })
    lastModifiedUID: number | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => Occurrence,
        (omoccurrences) => omoccurrences.associations,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'occid'}])
    occurrence: Promise<Occurrence>;

    @ManyToOne(
        () => Occurrence,
        (omoccurrences) => omoccurrences.associatedWith,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'occidassociate'}])
    associatedOccurrence: Promise<Occurrence>;

    @ManyToOne(() => Taxon, (taxa) => taxa.occurrenceAssociations, {
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'tid'}])
    taxon: Promise<Taxon>;

    @ManyToOne(() => User, (users) => users.createdOccurrenceAssociations, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'createduid', referencedColumnName: 'uid' }])
    creator: Promise<User>;

    @ManyToOne(() => User, (users) => users.modifiedOccurrenceAssociations, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'modifieduid', referencedColumnName: 'uid' }])
    lastModifiedUser: Promise<User>;
}
