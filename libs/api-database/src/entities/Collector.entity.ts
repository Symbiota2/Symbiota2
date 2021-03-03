import {
    Column,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { OccurrenceDetermination } from './occurrence/OccurrenceDetermination.entity';
import { EntityProvider } from '../entity-provider.class';

@Index('fullname', ['family', 'firstName'])
@Index(['preferredRecByID'])
@Entity('omcollectors')
export class Collector extends EntityProvider {
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'recordedById',
        unsigned: true
    })
    id: number;

    @Column('varchar', { name: 'familyname', length: 45 })
    family: string;

    @Column('varchar', { name: 'firstname', nullable: true, length: 45 })
    firstName: string | null;

    @Column('varchar', { name: 'middlename', nullable: true, length: 45 })
    middleName: string | null;

    @Column('int', { name: 'startyearactive', nullable: true })
    startYearActive: number | null;

    @Column('int', { name: 'endyearactive', nullable: true })
    endYearActive: number | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 255 })
    notes: string | null;

    @Column('int', { name: 'rating', nullable: true, default: () => '\'10\'' })
    rating: number | null;

    @Column('varchar', { name: 'guid', nullable: true, length: 45 })
    guid: string | null;

    @Column('int', { name: 'preferredrecbyid', nullable: true, unsigned: true })
    preferredRecByID: number | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date | null;

    @OneToMany(
        () => OccurrenceDetermination,
        (omoccurdeterminations) => omoccurdeterminations.collector
    )
    occurrenceDeterminations: Promise<OccurrenceDetermination[]>;
}
