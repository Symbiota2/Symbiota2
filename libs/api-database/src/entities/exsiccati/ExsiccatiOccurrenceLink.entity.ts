import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToOne,
} from 'typeorm';
import { ExsiccatiNumber } from './ExsiccatiNumber.entity';
import { Occurrence } from '../occurrence/Occurrence.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index('UniqueOmexsiccatiOccLink', ['occurrenceID'], { unique: true })
@Index(['exiccatiNumberID'])
@Index(['occurrenceID'])
@Entity('omexsiccatiocclink')
export class ExsiccatiOccurrenceLink extends EntityProvider {
    @Column('int', { primary: true, name: 'omenid', unsigned: true })
    exiccatiNumberID: number;

    @Column('int', { primary: true, name: 'occid', unsigned: true })
    occurrenceID: number;

    @Column('int', { name: 'ranking', default: () => '\'50\'' })
    ranking: number;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => ExsiccatiNumber,
        (omexsiccatinumbers) => omexsiccatinumbers.exsiccatiOccurrenceLinks,
        { onDelete: 'CASCADE', onUpdate: 'RESTRICT' }
    )
    @JoinColumn([{ name: 'omenid'}])
    exsiccatiNumber: Promise<ExsiccatiNumber>;

    @OneToOne(
        () => Occurrence,
        (omoccurrences) => omoccurrences.exsiccatiLinks,
        { onDelete: 'CASCADE', onUpdate: 'RESTRICT' }
    )
    @JoinColumn([{ name: 'occid'}])
    occurrence: Promise<Occurrence>;
}
