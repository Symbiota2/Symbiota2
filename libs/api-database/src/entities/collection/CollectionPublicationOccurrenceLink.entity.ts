import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Occurrence } from '../occurrence/Occurrence.entity';
import { CollectionPublication } from './CollectionPublication.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['occurrenceID'])
@Entity('omcollpuboccurlink')
export class CollectionPublicationOccurrenceLink extends EntityProvider {
    @Column('int', { primary: true, name: 'pubid', unsigned: true })
    publicationID: number;

    @Column('int', { primary: true, name: 'occid', unsigned: true })
    occurrenceID: number;

    @Column('int', { name: 'verification', default: () => '\'0\'' })
    verification: number;

    @Column('datetime', { name: 'refreshtimestamp' })
    refreshTimestamp: Date;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => Occurrence,
        (omoccurrences) => omoccurrences.publicationLinks,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'occid'}])
    occurrence: Promise<Occurrence>;

    @ManyToOne(
        () => CollectionPublication,
        (omcollpublications) => omcollpublications.occurrencePublicationLinks,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'pubid'}])
    publication: Promise<CollectionPublication>;
}
