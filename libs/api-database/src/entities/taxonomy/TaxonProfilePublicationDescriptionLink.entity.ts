import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { TaxonProfilePublication } from './TaxonProfilePublication.entity';
import { TaxonDescriptionBlock } from './TaxonDescriptionBlock.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['publicationID'])
@Entity('taxaprofilepubdesclink')
export class TaxonProfilePublicationDescriptionLink extends EntityProvider {
    @Column('int', { primary: true, name: 'tdbid', unsigned: true })
    descriptionBlockID: number;

    @Column('int', { primary: true, name: 'tppid' })
    publicationID: number;

    @Column('varchar', { name: 'caption', nullable: true, length: 45 })
    caption: string | null;

    @Column('varchar', { name: 'editornotes', nullable: true, length: 250 })
    editorNotes: string | null;

    @Column('int', { name: 'sortsequence', nullable: true })
    sortSequence: number | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date | null;

    @ManyToOne(
        () => TaxonProfilePublication,
        (taxaprofilepubs) => taxaprofilepubs.taxonDescriptionLinks,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'tppid'}])
    publication: Promise<TaxonProfilePublication>;

    @ManyToOne(
        () => TaxonDescriptionBlock,
        (taxadescrblock) => taxadescrblock.publicDescriptionLinks,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'tdbid'}])
    descriptionBlock: Promise<TaxonDescriptionBlock>;
}
