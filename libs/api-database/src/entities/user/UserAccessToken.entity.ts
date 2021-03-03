import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['uid'])
@Entity('useraccesstokens')
export class UserAccessToken extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'tokid' })
    id: number;

    @Column('int', { name: 'uid', unsigned: true })
    uid: number;

    @Column('varchar', { name: 'token', length: 50 })
    token: string;

    @Column('varchar', { name: 'device', length: 50, nullable: true })
    device: string;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(() => User, (users) => users.accessTokens, {
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn([{ name: 'uid', referencedColumnName: 'uid' }])
    user: Promise<User>;
}
