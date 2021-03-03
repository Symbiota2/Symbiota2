import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { SpeciesProcessorNLP } from './SpeciesProcessorNLP.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['nlpID'])
@Entity('specprocnlpfrag')
export class SpeciesProcessorNLPFrag extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'spnlpfragid' })
    id: number;

    @Column('int', { name: 'spnlpid' })
    nlpID: number;

    @Column('varchar', { name: 'fieldname', length: 45 })
    fieldName: string;

    @Column('varchar', { name: 'patternmatch', length: 250 })
    patternMatch: string;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string | null;

    @Column('int', { name: 'sortseq', nullable: true, default: () => '\'50\'' })
    sortSequence: number | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date | null;

    @ManyToOne(() => SpeciesProcessorNLP, (specprocnlp) => specprocnlp.specProcNLPFrags, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'spnlpid'}])
    speciesProcessorNLP: Promise<SpeciesProcessorNLP>;
}
