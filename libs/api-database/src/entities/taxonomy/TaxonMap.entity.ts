import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Taxon } from './Taxon.entity';
import { TaxonProfilePublicationMapLink } from './TaxonProfilePublicationMapLink.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['taxonID'])
@Entity('taxamaps')
export class TaxonMap extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'mid', unsigned: true })
    id: number;

    @Column('int', { name: 'tid', unsigned: true })
    taxonID: number;

    @Column('varchar', { name: 'url', length: 255 })
    url: string;

    @Column('varchar', { name: 'title', nullable: true, length: 100 })
    title: string | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(() => Taxon, (taxa) => taxa.taxonMaps, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn([{ name: 'tid'}])
    taxon: Promise<Taxon>;

    @OneToMany(
        () => TaxonProfilePublicationMapLink,
        (taxaprofilepubmaplink) => taxaprofilepubmaplink.map
    )
    taxonProfilePublicationLinks: Promise<TaxonProfilePublicationMapLink[]>;
}
