import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Taxon } from './Taxon.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index('Index_unique', ['taxonID', 'url'])
@Entity('taxalinks')
export class TaxonLink extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'tlid', unsigned: true })
    id: number;

    @Column('int', { name: 'tid', unsigned: true })
    taxonID: number;

    @Column('varchar', { name: 'url', length: 500 })
    url: string;

    @Column('varchar', { name: 'title', length: 100 })
    title: string;

    @Column('varchar', { name: 'sourceIdentifier', nullable: true, length: 45 })
    sourceIdentifier: string | null;

    @Column('varchar', { name: 'owner', nullable: true, length: 100 })
    owner: string | null;

    @Column('varchar', { name: 'icon', nullable: true, length: 45 })
    icon: string | null;

    @Column('int', { name: 'inherit', nullable: true, default: () => '\'1\'' })
    inherit: number | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string | null;

    @Column('int', {
        name: 'sortsequence',
        unsigned: true,
        default: () => '\'50\'',
    })
    sortSequence: number;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(() => Taxon, (taxa) => taxa.taxonLinks, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn([{ name: 'tid'}])
    taxon: Promise<Taxon>;
}
