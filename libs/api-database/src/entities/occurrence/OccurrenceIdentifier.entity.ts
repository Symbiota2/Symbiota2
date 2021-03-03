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
@Index('Index_value', ['identifierValue'])
@Entity('omoccuridentifiers')
export class OccurrenceIdentifier extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'idomoccuridentifiers' })
    id: number;

    @Column('int', { name: 'occid', unsigned: true })
    occurrenceID: number;

    @Column('varchar', { name: 'identifiervalue', length: 45 })
    identifierValue: string;

    @Column('varchar', {
        name: 'identifiername',
        nullable: true,
        comment: 'barcode, accession number, old catalog number, NPS, etc',
        length: 45,
    })
    identifierName: string | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string | null;

    @Column('int', { name: 'modifiedUid', unsigned: true })
    lastModifiedUID: number;

    @Column('datetime', { name: 'modifiedtimestamp', nullable: true })
    lastModifiedTimestamp: Date | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => Occurrence,
        (omoccurrences) => omoccurrences.identifiers,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'occid'}])
    occurrence: Promise<Occurrence>;
}
