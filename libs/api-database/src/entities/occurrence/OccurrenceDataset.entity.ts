import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Collection } from '../collection';
import { User } from '../user/User.entity';
import { OccurrenceDatasetLink } from './OccurrenceDatasetLink.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['uid'])
@Index(['collectionID'])
@Entity('omoccurdatasets')
export class OccurrenceDataset extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'datasetid', unsigned: true })
    id: number;

    @Column('varchar', { name: 'name', length: 100 })
    name: string;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string | null;

    @Column('int', { name: 'sortsequence', nullable: true })
    sortSequence: number | null;

    @Column('int', { name: 'uid', nullable: true, unsigned: true })
    uid: number | null;

    @Column('int', { name: 'collid', nullable: true, unsigned: true })
    collectionID: number | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => Collection,
        (omcollections) => omcollections.datasets,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'collid'}])
    collection: Promise<Collection>;

    @ManyToOne(() => User, (users) => users.occurrenceDatasets, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'uid', referencedColumnName: 'uid' }])
    user: Promise<User>;

    @OneToMany(
        () => OccurrenceDatasetLink,
        (omoccurdatasetlink) => omoccurdatasetlink.dataset
    )
    occurrenceDatasetLinks: Promise<OccurrenceDatasetLink[]>;
}
