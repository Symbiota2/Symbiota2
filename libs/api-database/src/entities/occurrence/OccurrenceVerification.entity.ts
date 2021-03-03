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

@Index('UNIQUE_omoccurverification', ['occurrenceID', 'category'], { unique: true })
@Index(['occurrenceID'])
@Index(['uid'])
@Entity('omoccurverification')
export class OccurrenceVerification extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'ovsid' })
    id: number;

    @Column('int', { name: 'occid', unsigned: true })
    occurrenceID: number;

    @Column('varchar', { name: 'category', length: 45 })
    category: string;

    @Column('int', { name: 'ranking' })
    ranking: number;

    @Column('varchar', { name: 'protocol', nullable: true, length: 100 })
    protocol: string;

    @Column('varchar', { name: 'source', nullable: true, length: 45 })
    source: string;

    @Column('int', { name: 'uid', nullable: true, unsigned: true })
    uid: number | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string;

    @Column('timestamp', {
        name: 'initialtimestamp',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date | null;

    @ManyToOne(
        () => Occurrence,
        (omoccurrences) => omoccurrences.verifications,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'occid'}])
    occurrence: Promise<Occurrence>;

    @ManyToOne(() => User, (users) => users.occurrenceVerifications, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'uid', referencedColumnName: 'uid' }])
    user: Promise<User>;
}
