import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ActionRequestType } from './ActionRequestType.entity';
import { User } from '../user/User.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['requesterUID'])
@Index(['fulfillerUID'])
@Index(['typeName'])
@Entity('actionrequest')
export class ActionRequest extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'bigint', name: 'actionrequestid' })
    id: number;

    @Column('int', { name: 'fk' })
    fk: number;

    @Column('varchar', { name: 'tablename', nullable: true, length: 255 })
    tableName: string;

    @Column('varchar', { name: 'requesttype', length: 30 })
    typeName: string;

    @Column('int', { name: 'uid_requestor', unsigned: true })
    requesterUID: number;

    @Column('timestamp', {
        name: 'requestdate',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    date: Date;

    @Column('varchar', { name: 'requestremarks', nullable: true, length: 900 })
    remarks: string;

    @Column('int', { name: 'priority', nullable: true })
    priority: number | null;

    @Column('int', { name: 'uid_fullfillor', unsigned: true })
    fulfillerUID: number;

    @Column('varchar', { name: 'state', nullable: true, length: 12 })
    state: string;

    @Column('varchar', { name: 'resolution', nullable: true, length: 12 })
    resolution: string;

    @Column('datetime', { name: 'statesetdate', nullable: true })
    stateSetDate: Date;

    @Column('varchar', {
        name: 'resolutionremarks',
        nullable: true,
        length: 900
    })
    resolutionRemarks: string;

    @ManyToOne(
        () => ActionRequestType,
        (actionrequesttype) => actionrequesttype.actionRequests,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'requesttype'}])
    type: Promise<ActionRequestType>;

    @ManyToOne(() => User, (users) => users.actionRequests, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'uid_requestor', referencedColumnName: 'uid' }])
    requester: Promise<User>;

    @ManyToOne(() => User, (users) => users.fulfilledActionRequests, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'uid_fullfillor', referencedColumnName: 'uid' }])
    fulfiller: Promise<User>;
}
