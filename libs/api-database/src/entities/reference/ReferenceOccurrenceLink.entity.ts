import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Occurrence } from '../occurrence/Occurrence.entity';
import { Reference } from './Reference.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['referenceID'])
@Index(['occurrenceID'])
@Entity('referenceoccurlink')
export class ReferenceOccurrenceLink extends EntityProvider {
    @Column('int', { primary: true, name: 'refid' })
    referenceID: number;

    @Column('int', { primary: true, name: 'occid', unsigned: true })
    occurrenceID: number;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => Occurrence,
        (omoccurrences) => omoccurrences.referenceLinks,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'occid'}])
    occurrence: Promise<Occurrence>;

    @ManyToOne(
        () => Reference,
        (referenceobject) => referenceobject.occurrenceLinks,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'refid'}])
    reference: Promise<Reference>;
}
