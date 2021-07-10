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

@Index(['taxonID', 'url'], { unique: true })
@Entity()
export class TaxonLink extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column('int', { unsigned: true })
    taxonID: number;

    @Column('varchar', { length: 500 })
    url: string;

    @Column('varchar', { length: 100 })
    title: string;

    @Column('varchar', { nullable: true, length: 45 })
    sourceIdentifier: string | null;

    @Column('varchar', { nullable: true, length: 100 })
    owner: string | null;

    @Column('varchar', { nullable: true, length: 45 })
    icon: string | null;

    @Column('int', { nullable: true, default: () => "'1'" })
    inherit: number | null;

    @Column('varchar', { nullable: true, length: 250 })
    notes: string | null;

    @Column('int', {
        unsigned: true,
        default: () => "'50'",
    })
    sortSequence: number;

    @Column('timestamp', {
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(() => Taxon, (taxa) => taxa.taxonLinks, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn([{ name: 'taxonID' }])
    taxon: Promise<Taxon>;
}
