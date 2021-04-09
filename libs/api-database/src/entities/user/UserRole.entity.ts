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
@Index('Index_userroles_table', ['tableName', 'tablePrimaryKey'])
@Entity('userroles')
export class UserRole extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'userroleid', unsigned: true })
    id: number;

    @Column('int', { name: 'uid', unsigned: true })
    uid: number;

    // Role name
    @Column('varchar', { name: 'role', length: 45 })
    name: ApiUserRoleName;

    // TODO: What're these?
    @Column('varchar', { name: 'tablename', nullable: true, length: 45 })
    tableName: string | null;

    @Column('int', { name: 'tablepk', nullable: true })
    tablePrimaryKey: number | null;

    // TODO: What's this?
    @Column('varchar', {
        name: 'secondaryVariable',
        nullable: true,
        length: 45
    })
    secondaryVariable: string | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string | null;

    @Column('int', { name: 'uidassignedby', nullable: true, unsigned: true })
    assignedByUID: number | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(() => User, (users) => users.roles, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'uid', referencedColumnName: 'uid' }])
    user: Promise<User>;

    @ManyToOne(() => User, (users) => users.assignedRoles, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'uidassignedby', referencedColumnName: 'uid' }])
    assigner: Promise<User>;
}
