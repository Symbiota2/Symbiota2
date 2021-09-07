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
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

@Index(['occurrenceID'])
@Index(['uid'])
@Entity('omoccurcomments')
export class OccurrenceComment extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'comid' })
    @ApiProperty()
    @Expose()
    id: number;

    @Column('int', { name: 'occid', unsigned: true })
    @ApiProperty()
    @Expose()
    occurrenceID: number;

    @Column('text', { name: 'comment' })
    @ApiProperty()
    @Expose()
    comment: string;

    @Column('int', { name: 'uid', unsigned: true })
    uid: number;

    @Column('int', {
        name: 'reviewstatus',
        unsigned: true,
        default: () => '\'0\''
    })
    @ApiProperty()
    @Expose()
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
    @ApiProperty()
    @Expose()
    @Type(() => OccurrenceCommenter)
    commenter: Promise<User> | User;
}

class OccurrenceCommenter {
    @ApiProperty()
    @Expose()
    uid: number;

    @ApiProperty()
    @Expose()
    username: string;

    @ApiProperty()
    @Expose()
    firstName: string;

    @ApiProperty()
    @Expose()
    lastName: string;
}
