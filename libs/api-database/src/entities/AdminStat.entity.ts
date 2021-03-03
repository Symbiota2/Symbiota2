import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Collection } from './collection/Collection.entity';
import { User } from './user/User.entity';
import { EntityProvider } from '../entity-provider.class';

@Index(['collectionID'])
@Index(['uid'])
@Index('Index_adminstats_ts', ['initialTimestamp'])
@Index('Index_category', ['category'])
@Entity('adminstats')
export class AdminStat extends EntityProvider {
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'idadminstats',
        unsigned: true
    })
    id: number;

    @Column('varchar', { name: 'category', length: 45 })
    category: string;

    @Column('varchar', { name: 'statname', length: 45 })
    name: string;

    @Column('int', { name: 'statvalue', nullable: true })
    value: number | null;

    @Column('int', { name: 'statpercentage', nullable: true })
    percentage: number | null;

    @Column('text', { name: 'dynamicProperties', nullable: true })
    dynamicProperties: string;

    @Column('int', { name: 'groupid' })
    groupID: number;

    @Column('int', { name: 'collid', nullable: true, unsigned: true })
    collectionID: number | null;

    @Column('int', { name: 'uid', nullable: true, unsigned: true })
    uid: number | null;

    @Column('varchar', { name: 'note', nullable: true, length: 250 })
    note: string;

    @Column('timestamp', {
        name: 'initialtimestamp',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(() => Collection, (omcollections) => omcollections.adminStats, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'collid'}])
    collection: Promise<Collection>;

    @ManyToOne(() => User, (users) => users.adminStats, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'uid', referencedColumnName: 'uid' }])
    user: Promise<User>;
}
