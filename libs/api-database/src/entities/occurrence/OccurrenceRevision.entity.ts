import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Occurrence } from './Occurrence.entity';
import { User } from '../user/User.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index('guid_UNIQUE', ['guid'], { unique: true })
@Index(['occurrenceID'])
@Index(['uid'])
@Index('Index_omrevisions_applied', ['appliedStatus'])
@Index('Index_omrevisions_reviewed', ['reviewStatus'])
@Index('Index_omrevisions_source', ['externalSource'])
@Index('Index_omrevisions_editor', ['externalEditor'])
@Entity('omoccurrevisions')
export class OccurrenceRevision extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'orid' })
    id: number;

    @Column('int', { name: 'occid', unsigned: true })
    occurrenceID: number;

    @Column('text', { name: 'oldValues', nullable: true })
    oldValues: string;

    @Column('text', { name: 'newValues', nullable: true })
    newValues: string;

    @Column('varchar', { name: 'externalSource', nullable: true, length: 45 })
    externalSource: string;

    @Column('varchar', { name: 'externalEditor', nullable: true, length: 100 })
    externalEditor: string;

    @Column('varchar', {
        name: 'guid',
        nullable: true,
        unique: true,
        length: 45
    })
    guid: string;

    @Column('int', { name: 'reviewStatus', nullable: true })
    reviewStatus: number | null;

    @Column('int', { name: 'appliedStatus', nullable: true })
    appliedStatus: number | null;

    @Column('varchar', { name: 'errorMessage', nullable: true, length: 500 })
    errorMessage: string;

    @Column('int', { name: 'uid', nullable: true, unsigned: true })
    uid: number | null;

    @Column('datetime', { name: 'externalTimestamp', nullable: true })
    externalTimestamp: Date | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => Occurrence,
        (omoccurrences) => omoccurrences.revisions,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'occid'}])
    occurrence: Promise<Occurrence>;

    @ManyToOne(() => User, (users) => users.occurrenceRevisions, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'uid', referencedColumnName: 'uid' }])
    user: Promise<User>;
}
