import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Collection } from './Collection.entity';
import { User } from '../user/User.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['contactID'])
@Entity('omcollectioncontacts')
export class CollectionContact extends EntityProvider {
    @Column('int', { primary: true, name: 'collid', unsigned: true })
    collectionID: number;

    @Column('int', { primary: true, name: 'uid', unsigned: true })
    contactID: number;

    @Column('varchar', { name: 'positionName', nullable: true, length: 45 })
    positionName: string | null;

    @Column('varchar', { name: 'role', nullable: true, length: 45 })
    role: string | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date | null;

    @ManyToOne(
        () => Collection,
        (omcollections) => omcollections.collectionContacts,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'collid'}])
    collection: Promise<Collection>;

    @ManyToOne(() => User, (users) => users.collectionContacts, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'uid', referencedColumnName: 'uid' }])
    contact: Promise<User>;
}
