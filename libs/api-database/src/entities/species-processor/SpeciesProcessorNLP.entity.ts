import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { SpeciesProcessorNLPFrag } from './SpeciesProcessorNLPFrag.entity';
import { Collection } from '../collection';
import { EntityProvider } from '../../entity-provider.class';

@Index(['collectionID'])
@Entity('specprocnlp')
export class SpeciesProcessorNLP extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'spnlpid' })
    id: number;

    @Column('varchar', { name: 'title', length: 45 })
    title: string;

    @Column('varchar', { name: 'sqlfrag', length: 250 })
    sqlFragment: string;

    @Column('varchar', { name: 'patternmatch', nullable: true, length: 250 })
    patternMatch: string | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string | null;

    @Column('int', { name: 'collid', unsigned: true })
    collectionID: number;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToMany(() => SpeciesProcessorNLPFrag, (specprocnlpfrag) => specprocnlpfrag.speciesProcessorNLP)
    specProcNLPFrags: Promise<SpeciesProcessorNLPFrag[]>;

    @ManyToOne(
        () => Collection,
        (omcollections) => omcollections.specprocnlps,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'collid'}])
    collection: Promise<Collection>;
}
