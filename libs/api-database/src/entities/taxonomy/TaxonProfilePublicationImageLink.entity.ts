import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { TaxonProfilePublication } from './TaxonProfilePublication.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['publicationID'])
@Entity()
export class TaxonProfilePublicationImageLink extends EntityProvider {
    @Column('int', { primary: true, unsigned: true })
    imageID: number;

    @Column('int', { primary: true })
    publicationID: number;

    @Column('varchar', { nullable: true, length: 45 })
    caption: string;

    @Column('varchar', { nullable: true, length: 250 })
    editorNotes: string;

    @Column('int', { nullable: true })
    sortSequence: number | null;

    @Column('timestamp', {
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date | null;

    @ManyToOne(
        () => TaxonProfilePublication,
        (taxaprofilepubs) => taxaprofilepubs.imageLinks,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn({ name: 'publicationID' })
    publication: Promise<TaxonProfilePublication>;

    // TODO: Image
    image = Promise.resolve(null);
}
