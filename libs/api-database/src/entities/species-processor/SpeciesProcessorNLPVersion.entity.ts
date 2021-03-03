import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { SpeciesProcessorRawLabel } from './SpeciesProcessorRawLabel.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['rawLabelID'])
@Entity('specprocnlpversion')
export class SpeciesProcessorNLPVersion extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'nlpverid' })
    id: number;

    @Column('int', { name: 'prlid', unsigned: true })
    rawLabelID: number;

    @Column('text', { name: 'archivestr' })
    archiveStr: string;

    @Column('varchar', {
        name: 'processingvariables',
        nullable: true,
        length: 250,
    })
    processingVariables: string | null;

    @Column('int', { name: 'score', nullable: true })
    score: number | null;

    @Column('varchar', { name: 'source', nullable: true, length: 150 })
    source: string | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date | null;

    @ManyToOne(
        () => SpeciesProcessorRawLabel,
        (specprocessorrawlabels) => specprocessorrawlabels.specProcNLPVersions,
        { onDelete: 'RESTRICT', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'prlid'}])
    rawLabel: Promise<SpeciesProcessorRawLabel>;
}
