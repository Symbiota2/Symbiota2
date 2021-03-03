import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Occurrence } from './Occurrence.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(
    'UNIQUE_occuraccess',
    ['occurrenceID', 'accessDate', 'ipAddress', 'type'],
    { unique: true }
)
@Entity('omoccuraccessstats')
export class OccurrenceAccessStat extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'oasid', unsigned: true })
    id: number;

    @Column('int', { name: 'occid', unsigned: true })
    occurrenceID: number;

    @Column('date', { name: 'accessdate' })
    accessDate: string;

    @Column('varchar', { name: 'ipaddress', length: 45 })
    ipAddress: string;

    @Column('int', { name: 'cnt', unsigned: true })
    count: number;

    @Column('varchar', { name: 'accesstype', length: 45 })
    type: string;

    @Column('varchar', {
        name: 'dynamicProperties',
        nullable: true,
        length: 250
    })
    dynamicProperties: string | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date | null;

    @ManyToOne(
        () => Occurrence,
        (omoccurrences) => omoccurrences.accessStats,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'occid'}])
    occurrence: Promise<Occurrence>;
}
