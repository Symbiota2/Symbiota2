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

@Index(['occurrenceID'])
@Index(['uid'])
@Entity('omoccurcomments')
export class OccurrenceComment extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'comid' })
    id: number;

    @Column('int', { name: 'occid', unsigned: true })
    occurrenceID: number;

    @Column('text', { name: 'comment' })
    comment: string;

    @Column('int', { name: 'uid', unsigned: true })
    uid: number;

    @Column('int', {
        name: 'reviewstatus',
        unsigned: true,
        default: () => '\'0\''
    })
    reviewStatus: number;

    @Column('int', { name: 'parentcomid', nullable: true, unsigned: true })
    parentCommentID: number | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => Occurrence,
        (omoccurrences) => omoccurrences.comments,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'occid'}])
    occurrence: Promise<Occurrence>;

    @ManyToOne(() => User, (users) => users.occurrenceComments, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'uid', referencedColumnName: 'uid' }])
    commenter: Promise<User>;
}
