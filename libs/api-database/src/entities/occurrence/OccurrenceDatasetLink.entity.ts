import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { OccurrenceDataset } from './OccurrenceDataset.entity';
import { Occurrence } from './Occurrence.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['datasetID'])
@Index(['occurrenceID'])
@Entity('omoccurdatasetlink')
export class OccurrenceDatasetLink extends EntityProvider {
    @Column('int', { primary: true, name: 'occid', unsigned: true })
    occurrenceID: number;

    @Column('int', { primary: true, name: 'datasetid', unsigned: true })
    datasetID: number;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => OccurrenceDataset,
        (omoccurdatasets) => omoccurdatasets.occurrenceDatasetLinks,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'datasetid'}])
    dataset: Promise<OccurrenceDataset>;

    @ManyToOne(
        () => Occurrence,
        (omoccurrences) => omoccurrences.datasetLinks,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'occid'}])
    occurrence: Promise<Occurrence>;
}
