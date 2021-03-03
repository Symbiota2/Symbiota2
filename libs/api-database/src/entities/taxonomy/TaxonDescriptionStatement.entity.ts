import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { TaxonDescriptionBlock } from './TaxonDescriptionBlock.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['descriptionBlockID'])
@Entity('taxadescrstmts')
export class TaxonDescriptionStatement extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'tdsid', unsigned: true })
    id: number;

    @Column('int', { name: 'tdbid', unsigned: true })
    descriptionBlockID: number;

    @Column('varchar', { name: 'heading', length: 75 })
    heading: string;

    @Column('text', { name: 'statement' })
    statement: string;

    @Column('int', {
        name: 'displayheader',
        unsigned: true,
        default: () => '\'1\'',
    })
    displayHeader: number;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string | null;

    @Column('int', {
        name: 'sortsequence',
        unsigned: true,
        default: () => '\'89\'',
    })
    sortSequence: number;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => TaxonDescriptionBlock,
        (taxadescrblock) => taxadescrblock.descriptionStatements,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'tdbid'}])
    descriptionBlock: Promise<TaxonDescriptionBlock>;
}
