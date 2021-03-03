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
@Index('Index_keyterm', ['keyTerm'])
@Entity('specprococrfrag')
export class SpeciesProcessorOCRFragment extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'ocrfragid', unsigned: true })
    id: number;

    @Column('int', { name: 'prlid', unsigned: true })
    rawLabelID: number;

    @Column('varchar', { name: 'firstword', length: 45 })
    firstWord: string;

    @Column('varchar', { name: 'secondword', nullable: true, length: 45 })
    secondWord: string | null;

    @Column('varchar', { name: 'keyterm', nullable: true, length: 45 })
    keyTerm: string | null;

    @Column('int', { name: 'wordorder', nullable: true })
    wordOrder: number | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date | null;

    @ManyToOne(
        () => SpeciesProcessorRawLabel,
        (specprocessorrawlabels) => specprocessorrawlabels.specProcessorOCRFragments,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'prlid'}])
    rawLabel: Promise<SpeciesProcessorRawLabel>;
}
