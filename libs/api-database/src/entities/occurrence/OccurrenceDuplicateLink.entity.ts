import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { OccurrenceDuplicate } from './OccurrenceDuplicate.entity';
import { Occurrence } from './Occurrence.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['occurrenceID'])
@Index(['duplicateID'])
@Entity('omoccurduplicatelink')
export class OccurrenceDuplicateLink extends EntityProvider {
    @Column('int', { primary: true, name: 'occid', unsigned: true })
    occurrenceID: number;

    @Column('int', { primary: true, name: 'duplicateid' })
    duplicateID: number;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string | null;

    @Column('int', { name: 'modifiedUid', nullable: true, unsigned: true })
    lastModifiedUID: number | null;

    @Column('datetime', { name: 'modifiedtimestamp', nullable: true })
    lastModifiedTimestamp: Date | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => OccurrenceDuplicate,
        (omoccurduplicates) => omoccurduplicates.links,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'duplicateid'}])
    duplicate: Promise<OccurrenceDuplicate>;

    @ManyToOne(
        () => Occurrence,
        (omoccurrences) => omoccurrences.duplicateLinks,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'occid'}])
    occurrence: Promise<Occurrence>;
}
