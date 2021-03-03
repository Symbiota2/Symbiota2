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

@Index('taxaresource_name', ['sourceName'])
@Index(['taxonID'])
@Entity('taxaresourcelinks')
export class TaxonResourceLink extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'taxaresourceid' })
    id: number;

    @Column('int', { name: 'tid', unsigned: true })
    taxonID: number;

    @Column('varchar', { name: 'sourcename', length: 150 })
    sourceName: string;

    @Column('varchar', { name: 'sourceidentifier', nullable: true, length: 45 })
    sourceIdentifier: string | null;

    @Column('varchar', { name: 'sourceguid', nullable: true, length: 150 })
    sourceGUID: string | null;

    @Column('varchar', { name: 'url', nullable: true, length: 250 })
    url: string | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string | null;

    @Column('int', { name: 'ranking', nullable: true })
    ranking: number | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(() => Taxon, (taxa) => taxa.resourceLinks, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'tid'}])
    taxon: Promise<Taxon>;
}
