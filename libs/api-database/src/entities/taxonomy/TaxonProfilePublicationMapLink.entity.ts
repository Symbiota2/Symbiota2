import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { TaxonProfilePublication } from './TaxonProfilePublication.entity';
import { TaxonMap } from './TaxonMap.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['publicationID'])
@Entity('taxaprofilepubmaplink')
export class TaxonProfilePublicationMapLink extends EntityProvider {
    @Column('int', { primary: true, name: 'mid', unsigned: true })
    mapID: number;

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
        (taxaprofilepubs) => taxaprofilepubs.mapLinks,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'tppid'}])
    publication: Promise<TaxonProfilePublication>;

    @ManyToOne(() => TaxonMap, (taxamaps) => taxamaps.taxonProfilePublicationLinks, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'mid'}])
    map: Promise<TaxonMap>;
}
