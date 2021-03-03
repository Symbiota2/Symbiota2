import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { OccurrenceLoan } from './OccurrenceLoan.entity';
import { Occurrence } from './Occurrence.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['occurrenceID'])
@Index(['loanID'])
@Entity('omoccurloanslink')
export class OccurrenceLoanLink extends EntityProvider {
    @Column('int', { primary: true, name: 'loanid', unsigned: true })
    loanID: number;

    @Column('int', { primary: true, name: 'occid', unsigned: true })
    occurrenceID: number;

    @Column('date', { name: 'returndate', nullable: true })
    returnDate: string | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 255 })
    notes: string | null;

    @Column('timestamp', {
        name: 'initialTimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => OccurrenceLoan,
        (omoccurloans) => omoccurloans.occurrenceLoanLinks,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'loanid'}])
    loan: Promise<OccurrenceLoan>;

    @ManyToOne(
        () => Occurrence,
        (omoccurrences) => omoccurrences.loanLinks,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'occid'}])
    occurrence: Promise<Occurrence>;
}
