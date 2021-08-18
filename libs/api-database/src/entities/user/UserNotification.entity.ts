import {
    Column,
    Entity, Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { EntityProvider } from '../../entity-provider.class';
import { User } from './User.entity';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ApiUserNotification } from '@symbiota2/data-access';

@Entity()
@Exclude()
@Index(['createdAt'])
@Index(['uid'])
export class UserNotification extends EntityProvider implements ApiUserNotification {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    @Expose()
    id: number;

    @Column({ unsigned: true })
    uid: number;

    @Column('text')
    @ApiProperty()
    @Expose()
    message: string;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP()' })
    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'uid' })
    user: Promise<User>;
}
