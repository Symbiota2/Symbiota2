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
import { ApiUserRoleName } from '@symbiota2/data-access';

@Index(['uid'])
@Index(['assignedByUID'])
@Index(['tablePrimaryKey'])
@Entity()
export class UserRole extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column('int', { unsigned: true })
    uid: number;

    // Role name
    @Column('varchar', { length: 45 })
    name: ApiUserRoleName;

    @Column('int', { nullable: true })
    tablePrimaryKey: number | null;

    @Column('int', { nullable: true, unsigned: true })
    assignedByUID: number | null;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP()' })
    initialTimestamp: Date;

    @ManyToOne(() => User, (users) => users.roles, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'uid' }])
    user: Promise<User>;

    @ManyToOne(() => User, (users) => users.assignedRoles, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'assignedByUID' }])
    assigner: Promise<User>;
}
