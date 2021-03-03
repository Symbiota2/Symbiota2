import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { TaxonProfilePublication } from './TaxonProfilePublication.entity';
import { Image } from '../image/Image.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['publicationID'])
@Entity('taxaprofilepubimagelink')
export class TaxonProfilePublicationImageLink extends EntityProvider {
    @Column('int', { primary: true, name: 'imgid', unsigned: true })
    imageID: number;

    @Column('int', { primary: true, name: 'tppid' })
    publicationID: number;

    @Column('varchar', { name: 'caption', nullable: true, length: 45 })
    caption: string;

    @Column('varchar', { name: 'editornotes', nullable: true, length: 250 })
    editorNotes: string;

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
        (taxaprofilepubs) => taxaprofilepubs.imageLinks,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'tppid'}])
    publication: Promise<TaxonProfilePublication>;

    @ManyToOne(() => Image, (images) => images.pubImageLinks, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'imgid'}])
    image: Promise<Image>;
}
