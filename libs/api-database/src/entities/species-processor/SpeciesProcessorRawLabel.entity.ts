import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { SpeciesProcessorNLPVersion } from './SpeciesProcessorNLPVersion.entity';
import { Image } from '../image/Image.entity';
import { Occurrence } from '../occurrence/Occurrence.entity';
import { SpeciesProcessorOCRFragment } from './SpeciesProcessorOCRFragment.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['imageID'])
@Index(['occurrenceID'])
@Entity('specprocessorrawlabels')
export class SpeciesProcessorRawLabel extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'prlid', unsigned: true })
    id: number;

    @Column('int', { name: 'imgid', nullable: true, unsigned: true })
    imageID: number | null;

    @Column('int', { name: 'occid', nullable: true, unsigned: true })
    occurrenceID: number | null;

    @Column('text', { name: 'rawstr' })
    rawStr: string;

    @Column('varchar', {
        name: 'processingvariables',
        nullable: true,
        length: 250,
    })
    processingVariables: string | null;

    @Column('int', { name: 'score', nullable: true })
    score: number | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 255 })
    notes: string | null;

    @Column('varchar', { name: 'source', nullable: true, length: 150 })
    source: string | null;

    @Column('int', { name: 'sortsequence', nullable: true })
    sortSequence: number | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToMany(
        () => SpeciesProcessorNLPVersion,
        (specprocnlpversion) => specprocnlpversion.rawLabel
    )
    specProcNLPVersions: Promise<SpeciesProcessorNLPVersion[]>;

    @ManyToOne(() => Image, (images) => images.specProcessorRawLabels, {
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'imgid'}])
    image: Promise<Image>;

    @ManyToOne(
        () => Occurrence,
        (omoccurrences) => omoccurrences.processorRawLabels,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'occid'}])
    occurrence: Promise<Occurrence>;

    @OneToMany(() => SpeciesProcessorOCRFragment, (specprococrfrag) => specprococrfrag.rawLabel)
    specProcessorOCRFragments: Promise<SpeciesProcessorOCRFragment[]>;
}
