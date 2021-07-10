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
@Entity()
export class TaxonDescriptionStatement extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column('int', { unsigned: true })
    descriptionBlockID: number;

    @Column('varchar', { length: 75 })
    heading: string;

    @Column('text')
    statement: string;

    @Column('int', {
        unsigned: true,
        default: () => "'1'",
    })
    displayHeader: number;

    @Column('varchar', { nullable: true, length: 250 })
    notes: string | null;

    @Column('int', {
        unsigned: true,
        default: () => '\'89\'',
    })
    sortSequence: number;

    @Column('timestamp', {
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => TaxonDescriptionBlock,
        (taxadescrblock) => taxadescrblock.descriptionStatements,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn({ name: 'descriptionBlockID' })
    descriptionBlock: Promise<TaxonDescriptionBlock>;
}
