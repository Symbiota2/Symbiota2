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

@Index(['sourceName'])
@Index(['taxonID'])
@Entity()
export class TaxonResourceLink extends EntityProvider {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', { unsigned: true })
    taxonID: number;

    @Column('varchar', { length: 150 })
    sourceName: string;

    @Column('varchar', { nullable: true, length: 45 })
    sourceIdentifier: string | null;

    @Column('varchar', { nullable: true, length: 150 })
    sourceGUID: string | null;

    @Column('varchar', { nullable: true, length: 250 })
    url: string | null;

    @Column('varchar', { nullable: true, length: 250 })
    notes: string | null;

    @Column('int', { nullable: true })
    ranking: number | null;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP()' })
    initialTimestamp: Date;

    @ManyToOne(() => Taxon, (taxa) => taxa.resourceLinks, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'taxonID' }])
    taxon: Promise<Taxon>;
}
