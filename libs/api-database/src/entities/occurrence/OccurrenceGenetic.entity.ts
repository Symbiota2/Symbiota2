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

@Index(['occurrenceID'])
@Index('INDEX_omoccurgenetic_name', ['resourceName'])
@Entity('omoccurgenetic')
export class OccurrenceGenetic extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'idoccurgenetic' })
    id: number;

    @Column('int', { name: 'occid', unsigned: true })
    occurrenceID: number;

    @Column('varchar', { name: 'identifier', nullable: true, length: 150 })
    identifier: string | null;

    @Column('varchar', { name: 'resourcename', length: 150 })
    resourceName: string;

    @Column('varchar', { name: 'title', nullable: true, length: 150 })
    title: string | null;

    @Column('varchar', { name: 'locus', nullable: true, length: 500 })
    locus: string | null;

    @Column('varchar', { name: 'resourceurl', nullable: true, length: 500 })
    resourceUrl: string | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 45 })
    notes: string | null;

    @Column('varchar', { name: 'initialtimestamp', nullable: true, length: 45 })
    initialTimestamp: string | null;

    @ManyToOne(
        () => Occurrence,
        (omoccurrences) => omoccurrences.genetics,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'occid'}])
    occurrence: Promise<Occurrence>;
}
