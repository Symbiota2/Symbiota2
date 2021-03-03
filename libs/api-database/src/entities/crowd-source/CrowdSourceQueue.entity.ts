import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Occurrence } from '../occurrence/Occurrence.entity';
import { User } from '../user/User.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['processorUID'])
@Index(['occurrenceID'], { unique: false })
@Entity('omcrowdsourcequeue')
export class CrowdSourceQueue extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'idomcrowdsourcequeue' })
    id: number;

    @Column('int', { name: 'omcsid' })
    crowdSourceID: number;

    @Column('int', { name: 'occid', unique: true, unsigned: true })
    occurrenceID: number;

    @Column('int', {
        name: 'reviewstatus',
        comment: '0=open,5=pending review, 10=closed',
        default: () => '\'0\'',
    })
    reviewStatus: number;

    @Column('int', { name: 'uidprocessor', nullable: true, unsigned: true })
    processorUID: number | null;

    @Column('int', {
        name: 'points',
        nullable: true,
        comment: '0=fail, 1=minor edits, 2=no edits <default>, 3=excelled',
    })
    points: number | null;

    @Column('int', { name: 'isvolunteer', default: () => '\'1\'' })
    isVolunteer: number;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToOne(
        () => Occurrence,
        (omoccurrences) => omoccurrences.crowdSourceQueue,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'occid'}])
    occurrence: Promise<Occurrence>;

    @ManyToOne(() => User, (users) => users.crowdSourceQueues, {
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'uidprocessor', referencedColumnName: 'uid' }])
    processor: Promise<User>;
}
