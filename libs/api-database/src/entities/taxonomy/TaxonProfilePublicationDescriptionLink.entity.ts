import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { TaxonProfilePublication } from './TaxonProfilePublication.entity';
import { TaxonDescriptionBlock } from './TaxonDescriptionBlock.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['publicationID'])
@Index(['descriptionBlockID'])
@Entity()
export class TaxonProfilePublicationDescriptionLink extends EntityProvider {
    @Column('int', { primary: true, unsigned: true })
    descriptionBlockID: number;

    @Column('int', { primary: true })
    publicationID: number;

    @Column('varchar', { nullable: true, length: 45 })
    caption: string | null;

    @Column('varchar', { nullable: true, length: 250 })
    editorNotes: string | null;

    @Column('int', { nullable: true })
    sortSequence: number | null;

    @Column('timestamp', {
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date | null;

    @ManyToOne(
        () => TaxonProfilePublication,
        (taxaprofilepubs) => taxaprofilepubs.taxonDescriptionLinks,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn({ name: 'publicationID' })
    publication: Promise<TaxonProfilePublication>;

    @ManyToOne(
        () => TaxonDescriptionBlock,
        (taxadescrblock) => taxadescrblock.publicDescriptionLinks,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn({ name: 'descriptionBlockID' })
    descriptionBlock: Promise<TaxonDescriptionBlock>;
}
