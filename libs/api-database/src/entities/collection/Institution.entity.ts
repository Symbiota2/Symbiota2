import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Collection } from './Collection.entity';
import { User } from '../user/User.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['lastModifiedUID'])
@Entity()
export class Institution extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column('varchar', { length: 45 })
    code: string;

    @Column('varchar', { length: 150 })
    name: string;

    @Column('varchar', { nullable: true, length: 150 })
    address1: string;

    @Column('varchar', { nullable: true, length: 150 })
    address2: string;

    @Column('varchar', { nullable: true, length: 45 })
    city: string;

    @Column('varchar', { nullable: true, length: 45 })
    stateProvince: string;

    @Column('varchar', { nullable: true, length: 45 })
    postalCode: string;

    @Column('varchar', { nullable: true, length: 45 })
    country: string;

    @Column('varchar', { nullable: true, length: 45 })
    phone: string;

    @Column('varchar', { nullable: true, length: 65 })
    contact: string;

    @Column('varchar', { nullable: true, length: 45 })
    email: string;

    @Column('varchar', { nullable: true, length: 250 })
    url: string;

    @Column('varchar', { nullable: true, length: 250 })
    notes: string;

    @Column('int', { nullable: true, unsigned: true })
    lastModifiedUID: number | null;

    @Column('datetime', { nullable: true })
    lastModifiedTimestamp: Date | null;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP()' })
    initialTimestamp: Date;

    @OneToMany(() => Collection, (omcollections) => omcollections.institution)
    collections: Promise<Collection[]>;

    @ManyToOne(() => User, (users) => users.institutions, {
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
    })
    @JoinColumn({ name: 'lastModifiedUID' })
    lastModifiedUser: Promise<User>;
}
